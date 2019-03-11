export default interface IContentHandler {
    canHandle(url: string): boolean;
    handle(): Promise<void>;
}
