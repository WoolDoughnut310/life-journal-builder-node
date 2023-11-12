import dotenv from 'dotenv'
import main from './main'

dotenv.config()
console.time()
main()
    .then(() => {console.timeEnd();process.exit(0)})
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
