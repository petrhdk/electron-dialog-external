# electron-dialog-external

Directly use the core functions from Electron's [`dialog`](https://www.electronjs.org/docs/api/dialog) module.  
This is really useful for small Node.js applications and scripts.
<br>

```bash
npm install electron-dialog-external
```

```js
const dialog = require('electron-dialog-external');

(async function() {
    await dialog.showOpenDialog(options);
    await dialog.showSaveDialog(options);
    await dialog.showMessageBox(options);
})();

dialog.showOpenDialogSync(options);
dialog.showSaveDialogSync(options);
dialog.showMessageBoxSync(options);
dialog.showErrorBox(title, content)
```

Please refer to the official Electron [docs](https://www.electronjs.org/docs/api/dialog) for concrete usage instructions. Everything behaves exactly the same <3.

This package is built on `Electron v11.2.0`.

<br>


### What is not supported?
+ passing an instance of [`BrowserWindow`](https://www.electronjs.org/docs/api/browser-window) as argument
+ passing an instance of [`NativeImage`](https://www.electronjs.org/docs/api/native-image) as argument

<br>


### Performance Tip
If you have the choice, prefer the `Promise` functions over the `Sync` functions, because all sync functions have a delay of about 1 second before the function returns.In contrast, the Promise functions resolve immediately.

I suspect the delay has something to do with the deconstruction of the Electron process, which apperently takes longer if we called a dialog Sync function.
Oddly enough, Electron's `dialog.*Sync()` function alone does not have any delay. And it is not the fault of `child_process.spawnSync()` either, because `child_process.spawn()` has the same delay if it runs an Electron process with a `dialog.*Sync()` call. The delay really has to come from the Electron "Main process" itself, which exits with delay if a `dialog.*Sync` function was used. Probably, it has something to do with the Event Loop xD.

<br>


### Examples?
See [`src/_test.ts`](src/_test.ts). It calls each function with example parameters. You could use that as a starting point ;)

<br>


### A note on errors
Theoretically the `dialog` functions should, just like the official functions, never throw an exception (sync functions) or reject (async functions / promises).
If it happens, then this is a bug. Please report on the [Issues page](https://github.com/pitizzzle/electron-dialog-external/issues).

<br>


### Troubleshooting
+ For obvious reasons, you can't use this module from an Operating System without graphical desktop. For instance, if you try to use `electron-dialog-external` from within Windows Subsystem for Linux (WSL), Electron will fail.

<br>


### Cue
If you know an easier way to achieve external usage of the `dialog` module than using child processes, please tell me ([Issues page](https://github.com/pitizzzle/electron-dialog-external/issues)).
