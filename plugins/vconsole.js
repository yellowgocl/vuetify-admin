// const Vconsole =
//   process.env.NODE_ENV !== 'production' ? require('vconsole') : {}

// export default ({ app }, inject) => {
//   if (process.env.NODE_ENV !== 'production') inject('vConsole', new Vconsole())
// }

import VConsole from 'vconsole'
const vConsole = process.env.NODE_ENV !== 'production' ? new VConsole() : ''
export default vConsole