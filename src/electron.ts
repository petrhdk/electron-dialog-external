/**
 * this file is launched by the Electron executable and will thereby become the Electron "Main process"
 */


// kill the electron app if something happens
// needed because by default, the electron process does not exit on uncaught exceptions or unhandled rejections
process.addListener('uncaughtException', (err) => {
    console.error(err);
    process.exit(1);
});
process.addListener('unhandledRejection', (reason) => {
    console.error(reason);
    process.exit(1);
});



import { app, dialog } from 'electron';  // this is resolved by the electron executable, maagic xD
import { DATA_ENV_VAR, FN_SHOW_ERROR_BOX, FN_SHOW_MESSAGE_BOX, FN_SHOW_MESSAGE_BOX_SYNC, PROP_SHOW_MESSAGE_BOX_SYNC_RESPONSE, PROP_ELECTRON_SUCCESS, PROP_FUNCTION_TYPE, FN_SHOW_OPEN_DIALOG, FN_SHOW_OPEN_DIALOG_SYNC, PROP_SHOW_OPEN_DIALOG_SYNC_RESPONSE, FN_SHOW_SAVE_DIALOG_SYNC, PROP_SHOW_SAVE_DIALOG_SYNC_RESPONSE, FN_SHOW_SAVE_DIALOG } from './constants';

app.whenReady().then(async () => {

    const data = JSON.parse("" + process.env[DATA_ENV_VAR]);
    const functionType = data[PROP_FUNCTION_TYPE];


    if (functionType === FN_SHOW_OPEN_DIALOG_SYNC) {
        const filePaths = dialog.showOpenDialogSync(data.options);
        respond({ [PROP_SHOW_OPEN_DIALOG_SYNC_RESPONSE]: filePaths });
    }
    else if (functionType === FN_SHOW_OPEN_DIALOG) {
        const { canceled, filePaths, bookmarks } = await dialog.showOpenDialog(data.options);
        respond({ canceled, filePaths, bookmarks });
    }
    else if (functionType === FN_SHOW_SAVE_DIALOG_SYNC) {
        const filePath = dialog.showSaveDialogSync(data.options);
        respond({ [PROP_SHOW_SAVE_DIALOG_SYNC_RESPONSE]: filePath });
    }
    else if (functionType === FN_SHOW_SAVE_DIALOG) {
        const { canceled, filePath, bookmark } = await dialog.showSaveDialog(data.options);
        respond({ canceled, filePath, bookmark });
    }
    else if (functionType === FN_SHOW_MESSAGE_BOX_SYNC) {
        const clickedButtonIndex = dialog.showMessageBoxSync(data.options);
        respond({ [PROP_SHOW_MESSAGE_BOX_SYNC_RESPONSE]: clickedButtonIndex });
    }
    else if (functionType === FN_SHOW_MESSAGE_BOX) {
        const { response, checkboxChecked } = await dialog.showMessageBox(data.options);
        respond({ response, checkboxChecked });
    }
    else if (functionType === FN_SHOW_ERROR_BOX) {
        dialog.showErrorBox(data.title, data.content);
        respond({});
    }
    else {
        throw new Error(`Function type "${functionType}" is invalid.`);
    }

    function respond(payload: Object) {
        process.stdout.write(JSON.stringify({
            ...payload,
            [PROP_ELECTRON_SUCCESS]: true,
        }));
        app.exit();
    }

});
