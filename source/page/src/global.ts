export class Global {
	public static editor: string = 'https://www.nunustudio.org/editor/index.html';

	public static openEditor(fname?: string): void {
		window.open(fname ? Global.editor + '?nsp=' + fname : Global.editor);
	}
}
