const stack: HTMLElement[] = []

export function onTrap() {}

export function onExit() {}

class FocusTrap {
  private stack: HTMLElement[] = []

  init = () => {}

  trap = () => {
    if (!stack.length) this.init()
    else this.push()

    return () => {}
  }

  exit = () => {}

  push = () => {
    // this.stack.push()
  }
}

export default new FocusTrap()
