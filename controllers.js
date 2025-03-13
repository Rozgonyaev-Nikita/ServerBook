import bcrypt from "bcrypt";
import {
  Author,
  BookLibrary,
  BookResponse,
  Category,
  ExchangeList,
  OfferList,
  Status,
  User,
  UserAddress,
  UserExchangeList,
  UserList,
  UserMsg,
  UserValueCategory,
  WishList,
} from "./models.js";
import mongoose from 'mongoose';  // Если используете ES6 модули

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
        res.status(401).json({ message: "Неверный пароль" });
        // res.json(false);
      }
    } else {
      // Пользователь не найден
      // res.json(false);
      res.status(404).json({ message: "Пользователь не найден" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }

  console.log(login, password);
};

// export const getBooks = async (req, res) => {
//   try {
//     console.log("cvfhghdfgcfhtx");
//     const {userName} = req.query;
    

//     // Находим пользователя по userName
//     const user = await User.findOne({ userName: userName });
//     if (!user) {
//         return res.status(404).json({ message: 'Пользователь не найден' });
//     }

//     // Находим книги, которые этот пользователь готов обменивать
//     const offers = await OfferList.find({ idUser: user._id }).populate({
//         path: 'idBookLibrary',
//         populate: {
//             path: 'idAuthor',
//             model: Author  // Здесь мы получаем автора книги
//         }
//     });

//     // Формируем ответ
//     const booksForExchange = offers.map(offer => ({
//         bookName: offer.idBookLibrary.bookName,
//         author: offer.idBookLibrary.idAuthor
//     }));

//     res.status(200).json(booksForExchange);
// } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Произошла ошибка на сервере' });
// }
// }

export const getOfferBooks = async (req, res) => {
  try {
    const { userName } = req.query;

    // Находим пользователя по userName
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Находим все книги, которые есть в ExchangeList
    const exchangeLists = await ExchangeList.find().populate({
      path: 'idOfferList1',
      populate: {
        path: 'idBookLibrary',
        model: BookLibrary
      }
    });

    const exchangedBooks = exchangeLists.flatMap(exchange => exchange.idOfferList1.idBookLibrary);

    // Находим книги, которые этот пользователь готов обменивать
    const offers = await OfferList.find({ idUser: user._id }).populate({
      path: 'idBookLibrary',
      populate: {
        path: 'idAuthor',
        model: Author  // Здесь мы получаем автора книги
      }
    });

    // Формируем список книг, которые можно обменять
    const booksForExchange = offers.map(offer => ({
      bookName: offer.idBookLibrary.bookName,
      author: offer.idBookLibrary.idAuthor.firstName + " " + offer.idBookLibrary.idAuthor.lastName,  // Получаем только идентификатор автора
      bookId: offer.idBookLibrary._id  // Добавляем идентификатор книги для дальнейшего использования
    }));

    // Фильтруем книги, чтобы оставить только те, которые отсутствуют в ExchangeList
    const filteredBooks = booksForExchange.filter(book =>
      !exchangedBooks.some(exchangedBook => exchangedBook._id.equals(book.bookId))
    );

    res.status(200).json(filteredBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Произошла ошибка на сервере' });
  }
}

export const getUserData = async (req, res) => {
  const { userName } = req.query;

  try {
    // Находим пользователя по логину
    const user = await User.findOne({ userName });
    console.log(user.userName)
    const add = await UserAddress.findOne({ idUser: user._id }).populate("idUser");
    console.log(add)

    if (add) {
      // отправляем все кроме пароля
      // const {...add2  } = add.toObject(); // Извлекаем пароль и сохраняем остальные данные в userData
      const resData = { ...add.toObject(), ...add.idUser.toObject() };
      delete resData.idUser;
      res.json(resData); // Отправляем только данные пользователя без пароля
    } else {
      // Пользователь не найден
      res.status(404).json({ message: "Пользователь не найден" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

export const changeUser = async (req, res) => {
  try {
    // const userId = req.params.id; // ID пользователя из параметров маршрута
    const {
      idUser,
      firstName,
      lastName,
      secondName,
      addCountry,
      addrIndex,
      addrCity,
      addrStreet,
      addrStructure,
      addrApart,
    } = req.body; // Извлекаем данные из тела запроса
    console.log(req.body);
    // Проверка: существует ли пользователь с указанным ID
    const user = await User.findById(idUser);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Обновление данных пользователя, если переданы новые значения
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (secondName) user.secondName = secondName;

    // Сохранение обновленных данных пользователя
    await user.save();

    // Проверяем, существует ли адрес для данного пользователя
    let userAddress = await UserAddress.findOne({ idUser: idUser });
    if (!userAddress) {
      // Если адрес не существует, создаем новый
      userAddress = new UserAddress({ idUser: idUser });
    }

    // Обновление данных адреса, если переданы новые значения
    if (addCountry) userAddress.addCountry = addCountry;
    if (addrIndex) userAddress.addrIndex = addrIndex;
    if (addrCity) userAddress.addrCity = addrCity;
    if (addrStreet) userAddress.addrStreet = addrStreet;
    if (addrStructure) userAddress.addrStructure = addrStructure;
    if (addrApart) userAddress.addrApart = addrApart;

    // Сохранение обновленных данных адреса
    await userAddress.save();

    // Ответ клиенту с обновленными данными
    res.status(200).json({
      message: "Данные пользователя успешно обновлены",
      user,
      userAddress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, userName, password, ...otherData } = req.body;
    const existingUser = await User.findOne({ email });
    console.log("email", existingUser);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      ...otherData,
      firstName,
      lastName,
      email,
      userName,
      password: hashedPassword,
    });
    console.log("user", user);
    const result = await user.save();

    if (result) {
      // delete result.password;
      res.send({
        ...otherData,
        firstName,
        lastName,
        email,
        userName,
        password: hashedPassword,
      });
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
    const {
      author_surname,
      author_name,
      book_title,
      isbn,
      year,
      category,
      status,
      userId,

      wishCategory,
      wishStatus,

      addCountry,
      addrIndex,
      addrCity,
      addrStreet,
      addrStructure,
      addrApart,
      isDefault,
    } = req.body;

    let userAddress = new UserAddress({
      idUser: userId,
      addCountry,
      addrIndex,
      addrCity,
      addrStreet,
      addrStructure,
      addrApart,
      isDefault,
    });
    await userAddress.save();

    // Create and save the author
    let author = await Author.findOne({
      lastName: author_surname,
      firstName: author_name,
    });
    if (!author) {
      author = new Author({ lastName: author_surname, firstName: author_name });
      await author.save();
    }

    let bookLibrary = await BookLibrary.findOne({
      idAuthor: author._id,
      bookName: book_title,
    });
    if (!bookLibrary) {
      bookLibrary = new BookLibrary({
        idAuthor: author._id,
        bookName: book_title,
      });
      await bookLibrary.save();
    }

    // Create and save the offer list entry
    const offerList = new OfferList({
      idBookLibrary: bookLibrary._id,
      idUser: userId,
      IBSN: isbn,
      yearPublishing: new Date(year),
      category,
      status
    });
    await offerList.save();

    const wishList = new WishList({
      idUser: userId,
      category: wishCategory,
      status: wishStatus,
      userAddress: userAddress._id,
    });
    await wishList.save();

    const alienWish = await WishList.findOne({
      _id: { $ne: userId },
      $and: [
        { category: { $in: category } },
        { status: status }
      ]
    });

    if (alienWish) {
      const alienOffer = await OfferList.findOne({
        idUser: alienWish.idUser,
        $and: [
          { category: { $in: wishCategory } },
          { status: wishStatus }
        ]
      });

      if (alienOffer) {
        const exchangeList = new ExchangeList({
          idOfferList1: offerList._id,
          idWishList1: wishList._id,
          idOfferList2: alienWish._id,
          idWishList2: alienOffer._id,
          isBoth: true
        });
        await exchangeList.save(); // Save the exchange list if necessary
        return res.status(201).json({ message: "Обмен совершен", offerList });
      }
    }

    return res.status(201).json({ message: "Обмен в ожидании", offerList });
  } catch (error) {
    return res.status(500).json({ message: "Error creating offer", karp: req.body, error });
  }
};



export const getBooksByUserName = async (req, res) => {
  try {
      const { idUser } = req.query;

      // 1. Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(idUser)) {
          return res.status(400).json({ message: "Invalid user ID" });
      }

      // 2. Aggregate Query
      const result = await ExchangeList.aggregate([
          // Lookup for the first OfferList
          {
              $lookup: {
                  from: "offerlists",
                  localField: "idOfferList1",
                  foreignField: "_id",
                  as: "offer1"
              }
          },
          { $unwind: "$offer1" },
          
          // Lookup for the second OfferList
          // {
          //     $lookup: {
          //         from: "offerlists",
          //         localField: "idOfferList2",
          //         foreignField: "_id",
          //         as: "offer2"
          //     }
          // },
          // { $unwind: "$offer2" },
          
          // Match the offers by user ID (either offer1 or offer2)
          {
              $match: 
                      { "offer1.idUser": new mongoose.Types.ObjectId(idUser) },
              
          },
          
          // Lookup for the first book
          {
              $lookup: {
                  from: "booklibraries",
                  localField: "offer1.idBookLibrary",
                  foreignField: "_id",
                  as: "book1"
              }
          },
          { $unwind: "$book1" },
          {
            $lookup: {
                from: 'authors', // название коллекции авторов
                localField: 'book1.idAuthor', // поле для соединения из основной коллекции
                foreignField: '_id', // поле для соединения из коллекции авторов
                as: 'author' // имя для массива с результатами соединения
            }
        },
        {
            $unwind: { // распаковываем массив author, чтобы получить объект
                path: '$author',
                preserveNullAndEmptyArrays: true // если автор не найден, оставляем поле пустым
            }
        },
          
          // Project the required fields
          {
              $project: {
                  _id: 0,
                  bookName1: "$book1.bookName",
                  author: "$author" // теперь это полный объект автора
              }
          }
      ]);

      res.json(result);
      
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
