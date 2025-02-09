import mongoose from 'mongoose';

const AuthorSchema = new Schema({//+
    LastName: { type: String, maxlength: 20, required: true },
    FirstName: { type: String, maxlength: 20, required: true }
});


const BookLibrarySchema = new Schema({//+
    IdAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    BookName: { type: String, maxlength: 50, required: true },
    Note: { type: String, maxlength: 50 }
});

const UserSchema = new Schema({//+
    FirstName: { type: String, maxlength: 25, required: true },
    LastName: { type: String, maxlength: 50, required: true },
    SecondName: { type: String, maxlength: 25 },
    Email: { type: String, maxlength: 25, unique: true, required: true },
    UserName: { type: String, maxlength: 20, unique: true, required: true },
    Password: { type: String, maxlength: 15, required: true },
    Rating: { type: Number, default: 0 },
    CreatedAt: { type: Date, default: Date.now },
    Avatar: { type: Buffer },
    Enabled: { type: Boolean, default: true },
    IsStaff: { type: Boolean, default: false },
    IsSuperUser: { type: Boolean, default: false }
});

const UserAddressSchema = new Schema({//+
    IdUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    AddCountry: { type: String, maxlength: 25 },
    AddrIndex: { type: String, maxlength: 6 },
    AddrCity: { type: String, maxlength: 15 },
    AddrStreet: { type: String, maxlength: 25 },
    AddrStructure: { type: String, maxlength: 10 },
    AddrApart: { type: String, maxlength: 3 },
    IsDefault: { type: Boolean, default: false }
});

const OfferListSchema = new Schema({//+
    IdBookLibrary: { type: mongoose.Schema.Types.ObjectId, ref: 'BookLibrary', required: true },
    IdUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    IBSN: { type: String, maxlength: 13 },
    YearPublishing: { type: Date },
    CreateAt: { type: Date, default: Date.now },
    UpdateAt: { type: Date },
    IdStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true }
});

const WishListSchema = new Schema({//+
    IdUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    CreateAt: { type: Date, default: Date.now },
    UpdateAt: { type: Date },
    IdStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true },
    IdUserAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAddress' }
});

const ExchangeListSchema = new Schema({//+   //ExchangeListSchema?
    IdOfferList1: { type: mongoose.Schema.Types.ObjectId, ref: 'OfferList', required: true },
    IdWishList1: { type: mongoose.Schema.Types.ObjectId, ref: 'WishList', required: true },
    IdOfferList2: { type: mongoose.Schema.Types.ObjectId, ref: 'OfferList', required: true },
    IdWishList2: { type: mongoose.Schema.Types.ObjectId, ref: 'WishList', required: true },
    CreateAt: { type: Date, default: Date.now },
    IsBoth: { type: Boolean, required: true }
});

const UserExchangeListSchema = new Schema({//+
    IdExchangeList: { type: mongoose.Schema.Types.ObjectId, ref: 'ExchangeList', required: true },
    IdOfferList: { type: mongoose.Schema.Types.ObjectId, ref: 'OfferList', required: true },
    TrackNumber: { type: String, maxlength: 20 },
    Receiving: { type: Boolean, default: false }
});

const UserListSchema = new Schema({//---------------------- ref куда?
    TypeList: { type: Number, required: true },
    // IdList: { type: mongoose.Schema.Types.ObjectId, required: true }    возможно стоит ссылаться на userScheme
});

const UserValueCategorySchema = new Schema({//+
    IdUserList: { type: mongoose.Schema.Types.ObjectId, ref: 'UserList', required: true },
    IdCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});

const CategorySchema = new Schema({//+
    Name: { type: String, maxlength: 25 },
    IdParent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    MultiSelect: { type: Boolean, default: false }
});

const StatusSchema = new Schema({//+
    Name: { type: String, maxlength: 10 }
});

const BookResponseSchema = new Schema({//+
    IdBookLibrary: { type: mongoose.Schema.Types.ObjectId, ref: 'BookLibrary', required: true },
    IdUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    CreateAt: { type: Date, default: Date.now },
    Response: { type: String, maxlength: 500 },
    Note: { type: String, maxlength: 50 }
});

const UserMsgSchema = new Schema({//+
    IdUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    CreateAt: { type: Date, default: Date.now },
    Text: { type: String, maxlength: 250 },
    Notes: { type: String, maxlength: 150 },
    IdStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'Status' },
    Type: { type: Number }
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