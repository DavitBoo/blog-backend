import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Define the JWT strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
      secretOrKey: JWT_SECRET, // Secret key to verify the JWT
    },
    async (payload, done) => {
      try {
        // Find the user based on the userId in the JWT payload
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
        });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        return done(null, user); 
      } catch (error) {
        console.error('Error during authentication:', error);
        return done(error, false); 
      }
    }
  )
);

// Middleware to initialize passport
export const initializePassport = () => passport.initialize();

// Middleware to authenticate requests
export const authenticateJwt = passport.authenticate('jwt', { session: false });


export default passport;
