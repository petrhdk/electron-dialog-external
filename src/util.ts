import { spawn } from 'child_process';


export interface AnyObject {
    [k: string]: any;
}


// these 2 fields normally do not exist on the 'child_process.spawn()'
/**
 * @param {string|Buffer} [options.input] the value which will be passed as stdin to the spawned process
 * @param {string} [options.encoding] optional string encoding for 'stdout' and 'stderr'
 */
export function spawnPromise(command: string, args?: string[], options?: AnyObject): Promise<{ stdout: string | Buffer, stderr: string | Buffer, exitCode: number | null; }> {
    return new Promise(async (resolve, reject) => {

        const cp = spawn(command, args, options);

        if (options && options.input)
            cp.stdin.write(options.input);

        const stdout: Buffer[] = [];
        const stderr: Buffer[] = [];
        cp.stdout.on('data', (chunk: Buffer) => {
            stdout.push(chunk);
        });
        cp.stderr.on('data', (chunk: Buffer) => {
            stderr.push(chunk);
        });

        const rejectErr = (err: Error) => { reject(err); };
        cp.stdout.on('error', rejectErr);  // "Emitted when an error occurs. Typically, this may occur if the underlying stream is unable to generate data due to an underlying internal failure, or when a stream implementation attempts to push an invalid chunk of data."
        cp.stderr.on('error', rejectErr);  //
        cp.on('error', rejectErr);   // "The process could not be spawned or killed, or sending a message to the child process failed."

        cp.on('exit', (exitCode) => {
            resolve({
                stdout: (options && options.encoding) ? Buffer.concat(stdout).toString(options.encoding) : Buffer.concat(stdout),
                stderr: (options && options.encoding) ? Buffer.concat(stderr).toString(options.encoding) : Buffer.concat(stderr),
                exitCode,
            });
        });
    });
}
