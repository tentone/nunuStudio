export class Global {
	public static editor: string = 'https://www.nunustudio.org/editor/index.html';

	public static repo: string = 'https://github.com/tentone/nunuStudio';

	public static openEditor(fname?: string): void {
		window.open(fname ? Global.editor + '?nsp=../' + fname : Global.editor);
	}
}
