import bcrypt from 'bcrypt';
import {Author, BookLibrary, BookResponse, Category, ExchangeList, OfferList, Status, User, UserAddress, UserExchangeList, UserList, UserMsg, UserValueCategory, WishList} from './models.js'


export const login = async (req, res) => {
  const { userName, password } = req.query;

  try {
    // Находим пользователя по логину
    const user = await User.findOne({ userName });

    if (user) {
      // Сравниваем введённый пароль с хешем, хранящимся в базе данных
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // отправляем все кроме пароля
        const { password, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
      } else {
        // Пароли не совпадают
        res.status(401).json({ message: 'Неверный пароль' });
        // res.json(false);
      }
    } else {
      // Пользователь не найден
      // res.json(false);
      res.status(404).json({ message: 'Пользователь не найден' });
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

export const exchangeBook = async (req, res) => {
  try {
    const { author_surname, author_name, book_title, isbn, year, genre, condition } = req.body;

    const author = new Author({ lastName: author_surname, firstName: author_name });
    await author.save();

    const bookLibrary = new BookLibrary({ idAuthor: author._id, bookName: book_title });
    await bookLibrary.save();

    const categorySchema = new CategorySchema({ name: condition });
    await categorySchema.save();

    

    const offerList = new OfferList({
        idBookLibrary: bookLibrary._id,
        IBSN: isbn,
        yearPublishing: new Date(year)  // Assuming year is a number like 2023
        // You might need to pass idUser and idStatus depending on your requirements
    });
    await offerList.save();

    res.status(201).json({ message: 'Offer created successfully', offerList });
} catch (error) {
    res.status(500).json({ message: 'Error creating offer', error });
}
};
