export const running = (status: AnimationPlayState) => {
  return status === 'running'
}

export const idle = (status: AnimationPlayState) => {
  return status === 'idle'
}

export const paused = (status: AnimationPlayState) => {
  return status === 'paused'
}

export const finished = (status: AnimationPlayState) => {
  return status === 'finished'
}
