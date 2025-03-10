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
      status,
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

