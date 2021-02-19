import { Request, Response } from 'express';
import * as AppUtils from '../../../app/utils';
import { StoreData, STORES_COLLECTION } from '../model';
import * as StoreUtils from '../utils';
import { ProductData, PRODUCTS_COLLECTION, PublicFacingProductData } from './model';
import * as ProductUtils from './utils';

/**
 * Create a product within a store.
 *
 * @param request.query.name 'name' parameter as a string
 *      - product name
 * @param request.query.productionCost 'productionCost' parameter as a number
 *      - cost to make the product, in the format 000.00
 * @param request.query.retailPrice 'retailPrice' parameter as a number
 *      - price the product is sold at, in the format 000.00
 * @param request.query.deliveryFee 'deliveryFee' parameter as a number
 *      - flat delivery fee for product, in the format 000.00
 * @param request.query.inventory optional 'inventory' parameter as a string
 *      - the count of inventory, if null, then assumed to be a product without inventory
 */
export const createProduct_POST = async (request: Request, response: Response) => {
    // Validate that the parameters exist
    const storeId = request.params.storeId;
    const productId = request.params.productId;
    const {
        name,
        productionCost: param_productionCost,
        retailPrice: param_retailPrice,
        deliveryFee: param_deliveryFee,
        inventory: param_inventory,
    } = request.query as {
        name: string,
        productionCost: string,
        retailPrice: string,
        deliveryFee: string,
        inventory?: string,
    };
    const productionCost = StoreUtils.isMoneyFormat(param_productionCost) && StoreUtils.getMoney(param_productionCost);
    const retailPrice = StoreUtils.isMoneyFormat(param_retailPrice) && StoreUtils.getMoney(param_retailPrice);
    const deliveryFee = StoreUtils.isMoneyFormat(param_deliveryFee) && StoreUtils.getMoney(param_deliveryFee);
    const inventory = StoreUtils.isCount(param_inventory) && StoreUtils.getCount(param_inventory as string);
    if (
        typeof productionCost !== 'number' ||
        typeof retailPrice !== 'number' ||
        typeof deliveryFee !== 'number'
    ) {
        // Note: this covers the cases when these parameters are null as well
        response.status(400).send("The parameters 'productionCost', 'retailPrice' & 'deliveryFee' must be provided and in the format 000.00.");
    }
    if (
        !!param_inventory && typeof inventory !== 'number'
    ) {
        response.status(400).send("The parameter 'inventory' must be an integer, if it is provided.");
    }
    if (!name) {
        response.status(400).send("The parameter 'name' must be provided.");
    }

    // Ccreate the product
    const productData: ProductData = {
        id: productId,
        name,
        productionCost: productionCost as number,
        retailPrice: retailPrice as number,
        deliveryFee: deliveryFee as number,
        inventory: inventory as number,
    };

    await ProductUtils.createProduct(storeId, productId, productData)
        .then(() => { return; })
        .catch(error => {
            AppUtils.handleGeneralError(response, error);
        });

    response.status(200).end();
};

/**
 * Get a particular product within a store.
 */
export const getProductById_GET = async (request: Request, response: Response) => {
    // Get parameters
    const storeId = request.params.storeId;
    const productId = request.params.productId;

    // Get document data
    const fullPath = `${STORES_COLLECTION}/${storeId}/${PRODUCTS_COLLECTION}/${productId}`;
    const productData = AppUtils.getDocumentDataFromResponse(response, fullPath) as ProductData;

    // Determine if user is an employee
    const storePath = `${STORES_COLLECTION}/${storeId}`;
    const storeData = AppUtils.getDocumentDataFromResponse(response, storePath) as StoreData;
    const { employeePrivateKey } = storeData;
    const { isEmployee: isEmployeeData } = AppUtils.getUserInfoFromResponse(response);
    const isEmployee: boolean = isEmployeeData?.[storeId] === employeePrivateKey;

    // Return the appropriate subset of StoreData
    const { productionCost, ...publicFacingProductData } = productData;
    const data: ProductData | PublicFacingProductData = (
        isEmployee ? productData : publicFacingProductData
    );

    response.status(200).send(data);
};
