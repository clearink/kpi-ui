import { spawn } from 'child_process'
import { consola } from 'consola'

export const a = 1

export function run(command: string, cwd: string) {
  return new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')

    consola.info(`run: ${command}`)

    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    const onExit = () => app.kill('SIGHUP')

    app.on('close', (code) => {
      process.removeListener('exit', onExit)

      if (code === 0) resolve()
      else reject(new Error(`Command failed. \n Command: ${command} \n Code: ${code}`))
    })

    process.on('exit', onExit)
  })
}
