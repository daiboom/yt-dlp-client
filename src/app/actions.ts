'use server'

import os from 'node:os'
const util = require('util')
const exec = util.promisify(require('child_process').exec)

interface Options {
  output?: string
}

interface DownloadOptions {
  videoUrl: string
  options?: Options
}

export async function download({ videoUrl, options }: DownloadOptions) {
  if (!videoUrl) {
    return
  }
  let command = 'yt-dlp'

  command += ` -o "${
    options?.output && options.output.length > 0
      ? options.output
      : '~/Downloads'
  }/%(title)s.%(ext)s"`

  if (!videoUrl) {
    return
  }

  command += ` '${videoUrl}'`

  return await promisifyExec(command)
}

export async function installYtDlpUsingBrew() {
  const command = 'brew install yt-dlp'

  return await promisifyExec(command)
}

export async function installBrewUsingShell(adminPassworld: string) {
  const command = `sudo -S ${adminPassworld} /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`

  return await promisifyExec(command)
}

export async function getOs() {
  return {
    hostname: await os.hostname(),
    loadavg: await os.loadavg(),
    uptime: await os.uptime(),
    freemem: await os.freemem(),
    totalmem: await os.totalmem(),
    cpus: await os.cpus(),
    availableParallelism: await os.availableParallelism(),
    type: await os.type(),
    release: await os.release(),
    networkInterfaces: await os.networkInterfaces(),
    homedir: await os.homedir(),
    userInfo: await os.userInfo(),
    arch: await os.arch(),
    version: await os.version(),
    platform: await os.platform(),
    machine: await os.machine(),
    tmpdir: await os.tmpdir(),
    endianness: await os.endianness(),
    getPriority: await os.getPriority(),
  }
}

export async function getDownloadFiles(outputPath: string = '') {
  outputPath =
    outputPath && outputPath.length > 0 ? `${outputPath} ` : `~/Downloads `

  const command = `ls ${outputPath}| egrep -h .mp4`

  return await promisifyExec(command)
}

async function promisifyExec(command: string) {
  try {
    const { error, stdout, stderr } = await exec(command)
    if (error) {
      throw new Error(error)
    } else if (stdout) {
      return stdout
    } else if (stderr) {
      return stderr
    }
  } catch (error) {
    return error
  }
}
