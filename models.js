import mongoose from 'mongoose';

const AuthorSchema = new mongoose.Schema({//+
    lastName: { type: String, maxlength: 20, required: true },
    firstName: { type: String, maxlength: 20, required: true }
});


const BookLibrarySchema = new mongoose.Schema({//+
    idAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    bookName: { type: String, maxlength: 50, required: true },
    note: { type: String, maxlength: 50 }
});

const UserSchema = new mongoose.Schema({//+
    firstName: { type: String, maxlength: 25 },
    lastName: { type: String, maxlength: 50 },
    secondName: { type: String, maxlength: 25 },
    email: { type: String, maxlength: 35, unique: true, required: true },
    userName: { type: String, maxlength: 25, unique: true, required: true },
    password: { type: String, required: true },
    rating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    avatar: { type: Buffer },
    enabled: { type: Boolean, default: true },
    isStaff: { type: Boolean, default: false },
    isSuperUser: { type: Boolean, default: false }
});

const UserAddressSchema = new mongoose.Schema({//+
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    addCountry: { type: String, maxlength: 25 },
    addrIndex: { type: String, maxlength: 6 },
    addrCity: { type: String, maxlength: 15 },
    addrStreet: { type: String, maxlength: 25 },
    addrStructure: { type: String, maxlength: 10 },
    addrApart: { type: String, maxlength: 3 },
    isDefault: { type: Boolean, default: false }
});

const OfferListSchema = new mongoose.Schema({//+
    idBookLibrary: { type: mongoose.Schema.Types.ObjectId, ref: 'BookLibrary', required: true },
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    IBSN: { type: String, maxlength: 13 },
    yearPublishing: { type: Date },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date },
    idStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true }
});

const WishListSchema = new mongoose.Schema({//+
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date },
    idStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true },
    idUserAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAddress' }
});

const ExchangeListSchema = new mongoose.Schema({//+   //ExchangeListSchema?
    idOfferList1: { type: mongoose.Schema.Types.ObjectId, ref: 'OfferList', required: true },
    idWishList1: { type: mongoose.Schema.Types.ObjectId, ref: 'WishList', required: true },
    idOfferList2: { type: mongoose.Schema.Types.ObjectId, ref: 'OfferList', required: true },
    idWishList2: { type: mongoose.Schema.Types.ObjectId, ref: 'WishList', required: true },
    createAt: { type: Date, default: Date.now },
    isBoth: { type: Boolean, required: true }
});

const UserExchangeListSchema = new mongoose.Schema({//+
    idExchangeList: { type: mongoose.Schema.Types.ObjectId, ref: 'ExchangeList', required: true },
    idOfferList: { type: mongoose.Schema.Types.ObjectId, ref: 'OfferList', required: true },
    trackNumber: { type: String, maxlength: 20 },
    receiving: { type: Boolean, default: false }
});

const UserListSchema = new mongoose.Schema({//---------------------- ref куда?
    typeList: { type: Number, required: true },
    // IdList: { type: mongoose.Schema.Types.ObjectId, required: true }    возможно стоит ссылаться на userScheme
});

const UserValueCategorySchema = new mongoose.Schema({//+
    idUserList: { type: mongoose.Schema.Types.ObjectId, ref: 'UserList', required: true },
    idCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});

// const CategorySchema = new mongoose.Schema({//+
//     name: { type: String, maxlength: 25 },
//     idParent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
//     multiSelect: { type: Boolean, default: false }
// });

const CategorySchema = new mongoose.Schema({//+
    genre:  [{ type: String, maxlength: 25 }],
    condition: { type: Boolean, default: false }
});

const StatusSchema = new mongoose.Schema({//+
    name: { type: String, maxlength: 10 }
});

const BookResponseSchema = new mongoose.Schema({//+
    idBookLibrary: { type: mongoose.Schema.Types.ObjectId, ref: 'BookLibrary', required: true },
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createAt: { type: Date, default: Date.now },
    response: { type: String, maxlength: 500 },
    note: { type: String, maxlength: 50 }
});

const UserMsgSchema = new mongoose.Schema({//+
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createAt: { type: Date, default: Date.now },
    text: { type: String, maxlength: 250 },
    notes: { type: String, maxlength: 150 },
    idStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'Status' },
    type: { type: Number }
});

export const Author = mongoose.model('Author', AuthorSchema);
export const BookLibrary = mongoose.model('BookLibrary', BookLibrarySchema);
export const User = mongoose.model('User', UserSchema);
export const UserAddress = mongoose.model('UserAddress', UserAddressSchema);
export const OfferList = mongoose.model('OfferList', OfferListSchema);
export const WishList = mongoose.model('WishList', WishListSchema);
export const ExchangeList = mongoose.model('ExchangeList', ExchangeListSchema);
export const UserExchangeList = mongoose.model('UserExchangeList', UserExchangeListSchema);
export const UserList = mongoose.model('UserList', UserListSchema);
export const UserValueCategory = mongoose.model('UserValueCategory', UserValueCategorySchema);
export const Category = mongoose.model('Category', CategorySchema);
export const Status = mongoose.model('Status', StatusSchema);
export const BookResponse = mongoose.model('BookResponse', BookResponseSchema);
export const UserMsg = mongoose.model('UserMsg', UserMsgSchema);