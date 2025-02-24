import bcrypt from 'bcrypt';
import {Author, BookLibrary, BookResponse, Category, ExchangeList, OfferList, Status, User, UserAddress, UserExchangeList, UserList, UserMsg, UserValueCategory, WishList} from './models.js'


export const login = async (req, res) => {
  const { userName, password } = req.query;

  try {
    // Находим пользователя по логину
    const user = await Users.findOne({ userName });

    if (user) {
      // Сравниваем введённый пароль с хешем, хранящимся в базе данных
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // отправляем все кроме пароля
        const { password, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
      } else {
        // Пароли не совпадают
        res.json(false);
      }
    } else {
      // Пользователь не найден
      res.json(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }

  console.log(login, password);
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, userName, password, ...otherData } = req.body;
    const existingUser = await User.findOne({ email });
    console.log('email', existingUser)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...otherData, firstName, lastName, email, userName, password: hashedPassword });
    console.log('user', user)
    const result = await user.save();
    
    if (result) {
      // delete result.password;
      res.send({ ...otherData, firstName, lastName, email, userName, password: hashedPassword });
      console.log(result);
    } else {
      console.log("Пользователь уже зарегистрирован");
    }

  } catch (e) {
    console.error(e);
    res.status(500).send("Something went wrong");
  }
};
