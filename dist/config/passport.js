"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = exports.initializePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
// Define the JWT strategy
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
    secretOrKey: JWT_SECRET, // Secret key to verify the JWT
}, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the user based on the userId in the JWT payload
        const user = yield prisma.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        return done(null, user);
    }
    catch (error) {
        console.error('Error during authentication:', error);
        return done(error, false);
    }
})));
// Middleware to initialize passport
const initializePassport = () => passport_1.default.initialize();
exports.initializePassport = initializePassport;
// Middleware to authenticate requests
exports.authenticateJwt = passport_1.default.authenticate('jwt', { session: false });
exports.default = passport_1.default;
