/*
  CONTRIBUTION:
     ⇒ type annotations are taken from the 'electron' release on npm
     
     ```
     Copyright (c) 2013-2020 GitHub Inc.

     Permission is hereby granted, free of charge, to any person obtaining
     a copy of this software and associated documentation files (the
     "Software"), to deal in the Software without restriction, including
     without limitation the rights to use, copy, modify, merge, publish,
     distribute, sublicense, and/or sell copies of the Software, and to
     permit persons to whom the Software is furnished to do so, subject to
     the following conditions:

     The above copyright notice and this permission notice shall be
     included in all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     ```

*/

import path from 'path';
import { DATA_ENV_VAR, FN_SHOW_ERROR_BOX, FN_SHOW_MESSAGE_BOX, FN_SHOW_MESSAGE_BOX_SYNC, PROP_SHOW_MESSAGE_BOX_SYNC_RESPONSE, PROP_ELECTRON_SUCCESS, PROP_FUNCTION_TYPE, FN_SHOW_OPEN_DIALOG, FN_SHOW_OPEN_DIALOG_SYNC, PROP_SHOW_OPEN_DIALOG_SYNC_RESPONSE, FN_SHOW_SAVE_DIALOG_SYNC, PROP_SHOW_SAVE_DIALOG_SYNC_RESPONSE, FN_SHOW_SAVE_DIALOG } from './constants';
import { AnyObject, spawnPromise } from './util';
import { spawnSync } from 'child_process';
import chalk from 'chalk';

const electronExecutablePath: string = "" + require('electron');


/**
 * this object hosts the 'electronChildProcess.sync()' and 'electronChildProcess.promise()' functions 
 * which nicely wrap the functionality of spawning the electron child process with right input and stuff
 * and then it returns/resolves with the data from the respective 'dialog' function
 */
const electronChildProcess = {

     /**
      * @returns {Object} the response object from specified the Electron 'dialog' function, fields depend on the functionType called (coded in 'electron.js')
      */
     sync(functionType: string, payload: Object): AnyObject {
          const { stdout, error } = spawnSync(...electronChildProcess._spawnArgs(functionType, payload));  // might throw exception
          if (error) {
               throw error;
          }
          return electronChildProcess._parseStdout("" + stdout); // we can be sure it's a string because always set the 'utf-8' encoding  // might throw exception
     },

     async promise(functionType: string, payload: Object): Promise<AnyObject> {
          const { stdout } = await spawnPromise(...electronChildProcess._spawnArgs(functionType, payload));  // might lead to reject
          return electronChildProcess._parseStdout("" + stdout);  // we can be sure it's a string because always set the 'utf-8' encoding  // might lead to reject
     },

     /**
      * @param payload typically, the only field is 'options', but in case of 'dialog.showErrorBox', there is also 'title' and 'content'
      * */
     _spawnArgs(functionType: string, payload: Object): [string, string[], Object] {
          return [
               electronExecutablePath,
               [path.join(__dirname, 'electron.js')],
               {
                    encoding: 'utf-8',
                    env: {
                         [DATA_ENV_VAR]: JSON.stringify({
                              ...payload,
                              [PROP_FUNCTION_TYPE]: functionType,
                         }),
                    },
               },
          ];
     },

     _parseStdout(stdout: string) {
          stdout = stdout.trim();  // if stdout contains an error instead the expected message, it usually has new-line padding '\r\n' at the rear and front, by removing it the error log becomes more readable ;)
          let data;
          try {
               data = JSON.parse(stdout); // might throw exception  // typically, if an error in the electron child process occurs, it is printed to STDERR, which is automatically redirected to STDOUT (by the electron process), and there it pollutes our stdout message and it becomes invalid JSON
          }
          catch (err) {
               throw new Error(`Response message from Electron child process is invalid JSON, stdout: "${chalk.inverse.red(stdout)}"`);
          }
          if (data[PROP_ELECTRON_SUCCESS] !== true) {
               throw new Error(`Response message from Electron child process is invalid, data: ${chalk.inverse.red(JSON.stringify(data))}`);
          }
          delete data[PROP_ELECTRON_SUCCESS];
          return data;
     }

};
















interface FileFilter {

     // Docs: https://electronjs.org/docs/api/structures/file-filter

     extensions: string[];
     name: string;
}

interface OpenDialogSyncOptions {
     title?: string;
     defaultPath?: string;
     /**
      * Custom label for the confirmation button, when left empty the default label will
      * be used.
      */
     buttonLabel?: string;
     filters?: FileFilter[];
     /**
      * Contains which features the dialog should use. The following values are
      * supported:
      */
     properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>;
     /**
      * Message to display above input boxes.
      *
      * @platform darwin
      */
     message?: string;
     /**
      * Create security scoped bookmarks when packaged for the Mac App Store.
      *
      * @platform darwin,mas
      */
     securityScopedBookmarks?: boolean;
}

/**
 * the file paths chosen by the user; if the dialog is cancelled it returns
 * `undefined`.
 *
 * The `browserWindow` argument allows the dialog to attach itself to a parent
 * window, making it modal.
 *
 * The `filters` specifies an array of file types that can be displayed or selected
 * when you want to limit the user to a specific type. For example:
 *
 * The `extensions` array should contain extensions without wildcards or dots (e.g.
 * `'png'` is good but `'.png'` and `'*.png'` are bad). To show all files, use the
 * `'*'` wildcard (no other wildcard is supported).
 *
 * **Note:** On Windows and Linux an open dialog can not be both a file selector
 * and a directory selector, so if you set `properties` to `['openFile',
 * 'openDirectory']` on these platforms, a directory selector will be shown.
 */
export function showOpenDialogSync(options: OpenDialogSyncOptions): (string[]) | (undefined) {
     const data = electronChildProcess.sync(FN_SHOW_OPEN_DIALOG_SYNC, { options });  // might throw exception
     return data[PROP_SHOW_OPEN_DIALOG_SYNC_RESPONSE];
}



// ================================================================================================



interface OpenDialogOptions {
     title?: string;
     defaultPath?: string;
     /**
      * Custom label for the confirmation button, when left empty the default label will
      * be used.
      */
     buttonLabel?: string;
     filters?: FileFilter[];
     /**
      * Contains which features the dialog should use. The following values are
      * supported:
      */
     properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>;
     /**
      * Message to display above input boxes.
      *
      * @platform darwin
      */
     message?: string;
     /**
      * Create security scoped bookmarks when packaged for the Mac App Store.
      *
      * @platform darwin,mas
      */
     securityScopedBookmarks?: boolean;
}

interface OpenDialogReturnValue {
     /**
      * whether or not the dialog was canceled.
      */
     canceled: boolean;
     /**
      * An array of file paths chosen by the user. If the dialog is cancelled this will
      * be an empty array.
      */
     filePaths: string[];
     /**
      * An array matching the `filePaths` array of base64 encoded strings which contains
      * security scoped bookmark data. `securityScopedBookmarks` must be enabled for
      * this to be populated. (For return values, see table here.)
      *
      * @platform darwin,mas
      */
     bookmarks?: string[];
}

/**
 * Resolve with an object containing the following:
 *
 * * `canceled` Boolean - whether or not the dialog was canceled.
 * * `filePaths` String[] - An array of file paths chosen by the user. If the
 * dialog is cancelled this will be an empty array.
 * * `bookmarks` String[] (optional) _macOS_ _mas_ - An array matching the
 * `filePaths` array of base64 encoded strings which contains security scoped
 * bookmark data. `securityScopedBookmarks` must be enabled for this to be
 * populated. (For return values, see table here.)
 *
 * The `browserWindow` argument allows the dialog to attach itself to a parent
 * window, making it modal.
 *
 * The `filters` specifies an array of file types that can be displayed or selected
 * when you want to limit the user to a specific type. For example:
 *
 * The `extensions` array should contain extensions without wildcards or dots (e.g.
 * `'png'` is good but `'.png'` and `'*.png'` are bad). To show all files, use the
 * `'*'` wildcard (no other wildcard is supported).
 *
 * **Note:** On Windows and Linux an open dialog can not be both a file selector
 * and a directory selector, so if you set `properties` to `['openFile',
 * 'openDirectory']` on these platforms, a directory selector will be shown.
 */
export async function showOpenDialog(options: OpenDialogOptions): Promise<OpenDialogReturnValue> {
     const { canceled, filePaths, bookmarks } = await electronChildProcess.promise(FN_SHOW_OPEN_DIALOG, { options });  // might lead to reject
     return { canceled, filePaths, bookmarks };
}



// ================================================================================================




interface SaveDialogSyncOptions {
     title?: string;
     /**
      * Absolute directory path, absolute file path, or file name to use by default.
      */
     defaultPath?: string;
     /**
      * Custom label for the confirmation button, when left empty the default label will
      * be used.
      */
     buttonLabel?: string;
     filters?: FileFilter[];
     /**
      * Message to display above text fields.
      *
      * @platform darwin
      */
     message?: string;
     /**
      * Custom label for the text displayed in front of the filename text field.
      *
      * @platform darwin
      */
     nameFieldLabel?: string;
     /**
      * Show the tags input box, defaults to `true`.
      *
      * @platform darwin
      */
     showsTagField?: boolean;
     properties?: Array<'showHiddenFiles' | 'createDirectory' | 'treatPackageAsDirectory' | 'showOverwriteConfirmation' | 'dontAddToRecent'>;
     /**
      * Create a security scoped bookmark when packaged for the Mac App Store. If this
      * option is enabled and the file doesn't already exist a blank file will be
      * created at the chosen path.
      *
      * @platform darwin,mas
      */
     securityScopedBookmarks?: boolean;
}

/**
 * the path of the file chosen by the user; if the dialog is cancelled it returns
 * `undefined`.
 *
 * The `browserWindow` argument allows the dialog to attach itself to a parent
 * window, making it modal.
 *
 * The `filters` specifies an array of file types that can be displayed, see
 * `dialog.showOpenDialog` for an example.
 */
export function showSaveDialogSync(options: SaveDialogSyncOptions): (string) | (undefined) {
     const data = electronChildProcess.sync(FN_SHOW_SAVE_DIALOG_SYNC, { options });  // might throw exception
     return data[PROP_SHOW_SAVE_DIALOG_SYNC_RESPONSE];
}



// ================================================================================================




interface SaveDialogOptions {
     title?: string;
     /**
      * Absolute directory path, absolute file path, or file name to use by default.
      */
     defaultPath?: string;
     /**
      * Custom label for the confirmation button, when left empty the default label will
      * be used.
      */
     buttonLabel?: string;
     filters?: FileFilter[];
     /**
      * Message to display above text fields.
      *
      * @platform darwin
      */
     message?: string;
     /**
      * Custom label for the text displayed in front of the filename text field.
      *
      * @platform darwin
      */
     nameFieldLabel?: string;
     /**
      * Show the tags input box, defaults to `true`.
      *
      * @platform darwin
      */
     showsTagField?: boolean;
     properties?: Array<'showHiddenFiles' | 'createDirectory' | 'treatPackageAsDirectory' | 'showOverwriteConfirmation' | 'dontAddToRecent'>;
     /**
      * Create a security scoped bookmark when packaged for the Mac App Store. If this
      * option is enabled and the file doesn't already exist a blank file will be
      * created at the chosen path.
      *
      * @platform darwin,mas
      */
     securityScopedBookmarks?: boolean;
}

interface SaveDialogReturnValue {
     /**
      * whether or not the dialog was canceled.
      */
     canceled: boolean;
     /**
      * If the dialog is canceled, this will be `undefined`.
      */
     filePath?: string;
     /**
      * Base64 encoded string which contains the security scoped bookmark data for the
      * saved file. `securityScopedBookmarks` must be enabled for this to be present.
      * (For return values, see table here.)
      *
      * @platform darwin,mas
      */
     bookmark?: string;
}

/**
 * Resolve with an object containing the following:
 *
 * * `canceled` Boolean - whether or not the dialog was canceled.
 * * `filePath` String (optional) - If the dialog is canceled, this will be
 * `undefined`.
 * * `bookmark` String (optional) _macOS_ _mas_ - Base64 encoded string which
 * contains the security scoped bookmark data for the saved file.
 * `securityScopedBookmarks` must be enabled for this to be present. (For return
 * values, see table here.)
 *
 * The `browserWindow` argument allows the dialog to attach itself to a parent
 * window, making it modal.
 *
 * The `filters` specifies an array of file types that can be displayed, see
 * `dialog.showOpenDialog` for an example.
 *
 * **Note:** On macOS, using the asynchronous version is recommended to avoid
 * issues when expanding and collapsing the dialog.
 */
export async function showSaveDialog(options: SaveDialogOptions): Promise<SaveDialogReturnValue> {
     const { canceled, filePath, bookmark } = await electronChildProcess.promise(FN_SHOW_SAVE_DIALOG, { options });  // might lead to reject
     return { canceled, filePath, bookmark };
}



// ================================================================================================



interface MessageBoxSyncOptions {
     /**
      * Can be `"none"`, `"info"`, `"error"`, `"question"` or `"warning"`. On Windows,
      * `"question"` displays the same icon as `"info"`, unless you set an icon using
      * the `"icon"` option. On macOS, both `"warning"` and `"error"` display the same
      * warning icon.
      */
     type?: string;
     /**
      * Array of texts for buttons. On Windows, an empty array will result in one button
      * labeled "OK".
      */
     buttons?: string[];
     /**
      * Index of the button in the buttons array which will be selected by default when
      * the message box opens.
      */
     defaultId?: number;
     /**
      * Title of the message box, some platforms will not show it.
      */
     title?: string;
     /**
      * Content of the message box.
      */
     message: string;
     /**
      * Extra information of the message.
      */
     detail?: string;
     /**
      * If provided, the message box will include a checkbox with the given label.
      */
     checkboxLabel?: string;
     /**
      * Initial checked state of the checkbox. `false` by default.
      */
     checkboxChecked?: boolean;

     // icon?: (NativeImage) | (string);   // <====================================================  XXX
     icon?: string;

     /**
      * The index of the button to be used to cancel the dialog, via the `Esc` key. By
      * default this is assigned to the first button with "cancel" or "no" as the label.
      * If no such labeled buttons exist and this option is not set, `0` will be used as
      * the return value.
      */
     cancelId?: number;
     /**
      * On Windows Electron will try to figure out which one of the `buttons` are common
      * buttons (like "Cancel" or "Yes"), and show the others as command links in the
      * dialog. This can make the dialog appear in the style of modern Windows apps. If
      * you don't like this behavior, you can set `noLink` to `true`.
      */
     noLink?: boolean;
     /**
      * Normalize the keyboard access keys across platforms. Default is `false`.
      * Enabling this assumes `&` is used in the button labels for the placement of the
      * keyboard shortcut access key and labels will be converted so they work correctly
      * on each platform, `&` characters are removed on macOS, converted to `_` on
      * Linux, and left untouched on Windows. For example, a button label of `Vie&w`
      * will be converted to `Vie_w` on Linux and `View` on macOS and can be selected
      * via `Alt-W` on Windows and Linux.
      */
     normalizeAccessKeys?: boolean;
}

/**
 * the index of the clicked button.
 *
 * Shows a message box, it will block the process until the message box is closed.
 * It returns the index of the clicked button.
 *
 * The `browserWindow` argument allows the dialog to attach itself to a parent
 * window, making it modal. If `browserWindow` is not shown dialog will not be
 * attached to it. In such case it will be displayed as an independent window.
 */
export function showMessageBoxSync(options: MessageBoxSyncOptions): number {
     const data = electronChildProcess.sync(FN_SHOW_MESSAGE_BOX_SYNC, { options });  // might throw exception
     return data[PROP_SHOW_MESSAGE_BOX_SYNC_RESPONSE];
}



// ================================================================================================



interface MessageBoxOptions {
     /**
      * Can be `"none"`, `"info"`, `"error"`, `"question"` or `"warning"`. On Windows,
      * `"question"` displays the same icon as `"info"`, unless you set an icon using
      * the `"icon"` option. On macOS, both `"warning"` and `"error"` display the same
      * warning icon.
      */
     type?: string;
     /**
      * Array of texts for buttons. On Windows, an empty array will result in one button
      * labeled "OK".
      */
     buttons?: string[];
     /**
      * Index of the button in the buttons array which will be selected by default when
      * the message box opens.
      */
     defaultId?: number;
     /**
      * Title of the message box, some platforms will not show it.
      */
     title?: string;
     /**
      * Content of the message box.
      */
     message: string;
     /**
      * Extra information of the message.
      */
     detail?: string;
     /**
      * If provided, the message box will include a checkbox with the given label.
      */
     checkboxLabel?: string;
     /**
      * Initial checked state of the checkbox. `false` by default.
      */
     checkboxChecked?: boolean;
     // icon?: NativeImage;   // <====================================================  XXX
     /**
      * The index of the button to be used to cancel the dialog, via the `Esc` key. By
      * default this is assigned to the first button with "cancel" or "no" as the label.
      * If no such labeled buttons exist and this option is not set, `0` will be used as
      * the return value.
      */
     cancelId?: number;
     /**
      * On Windows Electron will try to figure out which one of the `buttons` are common
      * buttons (like "Cancel" or "Yes"), and show the others as command links in the
      * dialog. This can make the dialog appear in the style of modern Windows apps. If
      * you don't like this behavior, you can set `noLink` to `true`.
      */
     noLink?: boolean;
     /**
      * Normalize the keyboard access keys across platforms. Default is `false`.
      * Enabling this assumes `&` is used in the button labels for the placement of the
      * keyboard shortcut access key and labels will be converted so they work correctly
      * on each platform, `&` characters are removed on macOS, converted to `_` on
      * Linux, and left untouched on Windows. For example, a button label of `Vie&w`
      * will be converted to `Vie_w` on Linux and `View` on macOS and can be selected
      * via `Alt-W` on Windows and Linux.
      */
     normalizeAccessKeys?: boolean;
}

interface MessageBoxReturnValue {
     /**
      * The index of the clicked button.
      */
     response: number;
     /**
      * The checked state of the checkbox if `checkboxLabel` was set. Otherwise `false`.
      */
     checkboxChecked: boolean;
}

/**
 * resolves with a promise containing the following properties:
 *
 * * `response` Number - The index of the clicked button.
 * * `checkboxChecked` Boolean - The checked state of the checkbox if
 * `checkboxLabel` was set. Otherwise `false`.
 *
 * Shows a message box, it will block the process until the message box is closed.
 *
 * The `browserWindow` argument allows the dialog to attach itself to a parent
 * window, making it modal.
 */
export async function showMessageBox(options: MessageBoxOptions): Promise<MessageBoxReturnValue> {
     const { response, checkboxChecked } = await electronChildProcess.promise(FN_SHOW_MESSAGE_BOX, { options });  // might lead to reject
     return { response, checkboxChecked };
}



// ================================================================================================



/**
 * Displays a modal dialog that shows an error message.
 *
 * Waits synchronously for the dismission of the dialog.
 *
 * This API can be called safely before the `ready` event the `app` module emits,
 * it is usually used to report errors in early stage of startup. If called before
 * the app `ready`event on Linux, the message will be emitted to stderr, and no GUI
 * dialog will appear.
 */
export function showErrorBox(title: string, content: string): void {
     electronChildProcess.sync(FN_SHOW_ERROR_BOX, { title, content });  // might throw exception
};


