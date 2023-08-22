import jwt from 'jsonwebtoken'
import config from 'config'

export default (req: any, res: any, next: any) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Нет авторизации' })
    }

    req.user = jwt.verify(token, config.get('jwtSecret'))
    next()
  } catch (e) {
    res.status(401).json({ message: 'Нет авторизации' })
  }

}
