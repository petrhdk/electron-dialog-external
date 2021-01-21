import { showErrorBox, showMessageBox, showMessageBoxSync, showOpenDialog, showOpenDialogSync, showSaveDialog, showSaveDialogSync } from './index';


(async function () {

    console.log('showOpenDialog [start]');
    const { canceled: canceled1, filePaths: filePaths1 } = await showOpenDialog({
        title: 'PLEASE SELECT A GODDAMN FILE',
        properties: ['multiSelections', 'showHiddenFiles'],
        filters: [{
            name: 'NIFTY-FILES-ONLY',
            extensions: ['js', 'ts'],
        }],
        buttonLabel: 'LOAD THAT SUCKER',
    });
    console.log('showOpenDialog [finish]', { canceled: canceled1, filePaths: filePaths1 }, '\n');



    console.log('showSaveDialog [start]');
    const { canceled: canceled2, filePath: filePath1 } = await showSaveDialog({
        title: 'PLEASE SELECT A GODDAMN FILE LOCATION',
        properties: ['showHiddenFiles'],
        filters: [{
            name: 'NIFTY-FILES-ONLY',
            extensions: ['js', 'ts'],
        }],
        buttonLabel: 'SAVE THAT SUCKER',
    });
    console.log('showSaveDialog [finish]', { canceled: canceled2, filePath: filePath1 }, '\n');



    console.log('showMessageBox [start]');
    const { response, checkboxChecked } = await showMessageBox({
        title: 'heyy',
        message: 'Nanuuuuu? 5678925298475109845710852452',
    });
    console.log('showMessageBox [finish]', { response, checkboxChecked }, '\n');



    console.log('showOpenDialogSync [start]');
    const filePaths2 = showOpenDialogSync({
        title: 'PLEASE SELECT A GODDAMN FILE',
        properties: ['multiSelections', 'showHiddenFiles'],
        filters: [{
            name: 'NIFTY-FILES-ONLY',
            extensions: ['js', 'ts'],
        }],
        buttonLabel: 'LOAD THAT SUCKER',
    });
    console.log('showOpenDialogSync [finish]', { filePaths: filePaths2 }, '\n');



    console.log('showSaveDialogSync [start]');
    const filePath2 = showSaveDialogSync({
        title: 'PLEASE SELECT A GODDAMN FILE LOCATION',
        properties: ['showHiddenFiles'],
        filters: [{
            name: 'NIFTY-FILES-ONLY',
            extensions: ['js', 'ts'],
        }],
        buttonLabel: 'SAVE THAT SUCKER',
    });
    console.log('showSaveDialogSync [finish]', { filePath: filePath2 }, '\n');



    console.log('showMessageBoxSync [start]');
    const clickedButtonIndex = showMessageBoxSync({
        title: 'heyy',
        message: 'Nanuuuuu? 5678925298475109845710852452',
    });
    console.log('showMessageBoxSync [finish]', { clickedButtonIndex }, '\n');



    console.log('showErrorBox [start]');
    showErrorBox('HOW DARE YOUUU??', 'MUAHAHAHAHAHAHAAA');
    console.log('showErrorBox [finish]', '\n');

})();

