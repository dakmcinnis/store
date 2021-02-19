/**
 * A full path from the root to the document in Firestore.
 * 
 * For example, if a document with id `b` is found at `collection 'upper' > document 'a' > collection 'lower'`,
 * then its full path will be `upper/a/lower/b`.
 */
export type PathIncludingDocumentId = string;

/**
 * Represents a path from the root to a document.
 * 
 * Items are ordered by increasing depth in Firestore.
 */
export type Path = DocumentByParam[];

/**
 * Represents a single document. Used for middleware.
 * 
 * @property parentCollection - the collection that contains the document
 * @property paramName - the name of the URL parameter that will contain the document id
 * @property shouldExist - whether we expect the document to exist or not
 */
export interface DocumentByParam {
    parentCollection: string;
    paramName: string;
    shouldExist: boolean;
}
