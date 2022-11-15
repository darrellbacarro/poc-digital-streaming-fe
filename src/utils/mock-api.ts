import { rest } from "msw";
import { setupServer } from "msw/node";

const BASE_URL = "http://192.168.1.4:3000";

export const server = setupServer(
  rest.get(`${BASE_URL}/movies`, (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Movies retrieved successfully!",
        data: {
          total: 79,
          items: [
            {
              id: "6368a3cddcd1a9dc620a3c1b",
              title: "The Suicide Squad",
              poster:
                "https://image.tmdb.org/t/p/original/kb4s0ML0iVZlG6wAKbbs9NAm6X.jpg",
              cost: 185000000,
              release_year: 2021,
              runtime: 132,
              plot: "Supervillains Harley Quinn, Bloodsport, ...",
              backdrop:
                "https://image.tmdb.org/t/p/original/jlGmlFOcfo8n5tURmhC7YVd4Iyy.jpg",
              genres: [],
              actors: [],
            },
            {
              id: "6368a3cddcd1a9dc620a3c1c",
              title: "Naruto Shippuden the Movie",
              poster:
                "https://image.tmdb.org/t/p/original/vDkct38sSFSWJIATlfJw0l3QOIR.jpg",
              cost: 29000000,
              release_year: 2007,
              runtime: 94,
              plot: "Demons that once a...",
              backdrop:
                "https://image.tmdb.org/t/p/original/mUC2BS04DlszdqJQ9vz9MFuPiDd.jpg",
              genres: [],
              actors: [],
            },
          ],
        },
      })
    );
  }),
  rest.post(`${BASE_URL}/users/login`, async (req, res, ctx) => {
    const { email, password } = await req.json();
    let responseJson: any = {
      success: true,
      message: "Successfully logged in",
      data: {
        token: "token",
        user: {
          id: "636801c301a37899c5a6e33a",
          email: "user1@email.com",
          fullname: "Test User",
          role: "USER",
          approved: true,
          enabled: false,
          favorites: {
            "6368a3cddcd1a9dc620a3c1b": true,
          },
        },
      },
    };

    if (email === "admin@email.com") {
      responseJson.data.user.role = "ADMIN";
    }

    if (password !== "123") {
      responseJson = {
        success: false,
        message: "Invalid email or password.",
        data: null,
      };
    }

    return res(ctx.json(responseJson));
  }),
  rest.post(`${BASE_URL}/users/register`, async (req, res, ctx) => {
    let fullname = "Test User";

    try {
      const { fullname: fn } = await req.json();
      fullname = fn;
    } catch (e) {}

    let response: any = {
      success: true,
      message: "Registration successful!",
      data: {
        id: "636a328452f3192643d1fee9",
        fullname: "John Smith 4",
        email: "johnsmith4@email.com",
        role: "ADMIN",
        enabled: false,
        approved: false,
      },
    };

    if (fullname === "Invalid") {
      response = {
        success: false,
        message: "Registration failed!",
        data: null,
      };
    }

    return res(ctx.json(response));
  }),
  rest.post(`${BASE_URL}/validate-email`, async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Email validated successfully!",
        data: { valid: true },
      })
    );
  }),
  rest.get(`${BASE_URL}/actors`, async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Actors retrieved successfully!",
        data: {
          total: 42,
          items: [
            {
              id: "63673d13bc59e15587e887b0",
              firstname: "Keanu",
              lastname: "Reeves",
              gender: "M",
              birthdate: "1976-01-01",
              photo:
                "https://storage.googleapis.com/poc-app-3eca2.appspot.com/Frame%2011844b468d2d.png",
              bio: "Lorem ipsum",
            },
            {
              id: "636812c70c03215cb31ebdd6",
              firstname: "Logan",
              lastname: "Lerman",
              gender: "M",
              birthdate: "1992-01-19",
              photo:
                "https://storage.googleapis.com/poc-app-3eca2.appspot.com/logan1844e8954ca.jpeg",
              bio: "Logan Wade Lerman is an...",
            },
          ],
        },
      })
    );
  }),
  rest.get(`${BASE_URL}/users`, async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Users retrieved successfully!",
        data: {
          total: 23,
          items: [
            {
              id: "63663ca9fd0b46690a8c24b1",
              fullname: "John Doe",
              email: "johndoe@email.com",
              role: "ADMIN",
              photo:
                "https://storage.googleapis.com/poc-app-3eca2.appspot.com/Frame%2011844e325ad3.png",
              enabled: true,
              approved: true,
            },
            {
              id: "636648ac2322f5797758bb30",
              fullname: "Darrell Bacarro",
              email: "darrell@email.com",
              role: "ADMIN",
              photo:
                "https://storage.googleapis.com/poc-app-3eca2.appspot.com/Image184478bdc76.png",
              enabled: true,
              approved: true,
            },
          ],
        },
      })
    );
  }),
  rest.get(`${BASE_URL}/genres`, async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Genres retrieved successfully!",
        data: {
          total: 4,
          items: [
            {
              id: "63684b11ef05a840a058d1f7",
              title: "Horror",
              gradient: "aqua-splash",
            },
            {
              id: "63684ba4c7191750cc4af689",
              title: "Sci-Fi",
              gradient: "spiky-naga",
            },
            {
              id: "6368d7e92bc63fa1e1b4cc67",
              title: "Romance",
              gradient: "red-salvation",
            },
            {
              id: "6369f8e5bb253e56176a4672",
              title: "Drama",
              gradient: "jungle-day",
            },
          ],
        },
      })
    );
  }),
  rest.delete(`${BASE_URL}/users/:id`, async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "User deleted successfully!",
        data: null,
      })
    );
  }),
  rest.delete(`${BASE_URL}/movies/:id`, async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Movie deleted successfully!",
        data: null,
      })
    );
  }),
  rest.delete(`${BASE_URL}/genres/:id`, async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Genre deleted successfully!",
        data: null,
      })
    );
  }),
  rest.delete(`${BASE_URL}/actors/:id`, async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Actor deleted successfully!",
        data: null,
      })
    );
  }),
  rest.get(`${BASE_URL}/actors/:id`, async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Actor retrieved successfully!",
        data: {
          id: "63673d13bc59e15587e887b0",
          firstname: "Keanu",
          lastname: "Reeves",
          gender: "M",
          birthdate: "1976-01-01",
          photo:
            "https://storage.googleapis.com/poc-app-3eca2.appspot.com/Frame%2011844b468d2d.png",
          bio: "Lorem ipsum",
          movies: [
            {
              _id: "6369f804bb253e56176a466f",
              title: "A Haunted House 2",
              poster:
                "https://storage.googleapis.com/poc-app-3eca2.appspot.com/A-Haunted-House-2-poster18455f0ca7f.jpg",
              cost: 4000000,
              release_year: 2014,
              runtime: 100,
              plot: "After exorcising the demons of his ex-, Malcolm starts afresh with his new girlfriend and her two children. After moving into their dream home, Malcolm is once again plagued by bizarre paranormal events.",
              backdrop:
                "https://storage.googleapis.com/poc-app-3eca2.appspot.com/A-Haunted-House-2-backdrop18455f0ca87.jpg",
              genres: [
                {
                  id: "63684b11ef05a840a058d1f7",
                  title: "Horror",
                  gradient: "aqua-splash",
                },
                {
                  id: "6368d7e92bc63fa1e1b4cc67",
                  title: "Romance",
                  gradient: "red-salvation",
                },
                {
                  id: "63684ba4c7191750cc4af689",
                  title: "Sci-Fi",
                  gradient: "spiky-naga",
                },
              ],
            },
          ],
          totalMovies: 1,
        },
      })
    );
  }),
  rest.patch(`${BASE_URL}/reviews/:id/approval`, async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Review approval updated.",
      })
    );
  }),
  rest.get(`${BASE_URL}/movies/:id/reviews`, async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Review retrieved successfully!",
        data: {
          total: 1,
          items: [
            {
              _id: '6368c3522bc63fa1e1b4cc66',
              content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
              rating: 4.5,
              approved: true,
              user: {
                fullname: 'User 1',
                userId: '636801c301a37899c5a6e33a'
              },
              postedAt: '2022-11-07T08:35:30.557Z'
            }
          ]
        },
      })
    );
  }),
  rest.get(`${BASE_URL}/reviews`, async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Reviews retrieved successfully!",
        data: {
          total: 5,
          items: [
            {
              _id: "636768cd403dad314baf866a",
              content: "This is amazing",
              rating: 4,
              approved: true,
              user: {
                userId: "63663b25c3ee4265239477ce",
                fullname: "Jane Doe",
                photo:
                  "https://storage.googleapis.com/poc-app-3eca2.appspot.com/Image184475cf0ec.png",
              },
              movie: {
                movieId: "6368a3cddcd1a9dc620a3c1b",
                title: "Test Movie",
                poster:
                  "https://storage.googleapis.com/poc-app-3eca2.appspot.com/Frame%2011844b51eca8.png",
              },
            },
            {
              _id: "6367996bc4c52675206b18da",
              content: "This is amazing",
              rating: 5,
              approved: false,
              user: {
                userId: "63663b25c3ee4265239477ce",
                fullname: "Jane Doe",
                photo:
                  "https://storage.googleapis.com/poc-app-3eca2.appspot.com/Image184475cf0ec.png",
              },
              movie: {
                movieId: "6368a3cddcd1a9dc620a3c1b",
                title: "Test Movie",
                poster:
                  "https://storage.googleapis.com/poc-app-3eca2.appspot.com/Frame%2011844b51eca8.png",
              },
            },
            {
              _id: "636799a7a6881675bc7dc9f9",
              content: "This is amazing",
              rating: 3,
              approved: true,
              user: {
                userId: "63663b25c3ee4265239477ce",
                fullname: "Jane Doe",
                photo:
                  "https://storage.googleapis.com/poc-app-3eca2.appspot.com/Image184475cf0ec.png",
              },
              movie: {
                movieId: "6368a3cddcd1a9dc620a3c1b",
                title: "Test Movie",
                poster:
                  "https://storage.googleapis.com/poc-app-3eca2.appspot.com/Frame%2011844b51eca8.png",
              },
              postedAt: "2022-11-06T11:25:27.945Z",
            },
            {
              _id: "6368c3522bc63fa1e1b4cc66",
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
              rating: 4.5,
              approved: true,
              user: {
                fullname: "User 1",
                userId: "636801c301a37899c5a6e33a",
              },
              movie: {
                movieId: "6368a413dcd1a9dc620a3c4c",
                title: "The Purge: Election Year",
                poster:
                  "https://image.tmdb.org/t/p/original/dx5pKJpGbJc9xrFQ8UR1XrrqmPj.jpg",
              },
              postedAt: "2022-11-07T08:35:30.557Z",
            },
            {
              _id: "6369f4f0bb253e56176a466c",
              content: "This is an example review for this movie",
              rating: 5,
              approved: true,
              user: {
                userId: "636801c301a37899c5a6e33a",
                fullname: "User 1",
              },
              movie: {
                movieId: "6368a3cddcd1a9dc620a3c1c",
                title: "Naruto Shippuden the Movie",
                poster:
                  "https://image.tmdb.org/t/p/original/vDkct38sSFSWJIATlfJw0l3QOIR.jpg",
              },
              postedAt: "2022-11-08T06:19:28.482Z",
            },
          ],
        },
      })
    );
  }),
  rest.all('*', async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Successful request",
        data: {},
      })
    );
  }),
);


export const moviePageData = {
  currentMovie: {
    id: '6368a413dcd1a9dc620a3c4c',
    title: 'The Purge: Election Year',
    poster: 'https://image.tmdb.org/t/p/original/dx5pKJpGbJc9xrFQ8UR1XrrqmPj.jpg',
    cost: 10000000,
    release_year: 2016,
    rating: 4.5,
    runtime: 105,
    plot: 'Two years after choosing not to kill the man who killed his son, former police sergeant Leo Barnes has become head of security for Senator Charlene Roan, the front runner in the next Presidential election due to her vow to eliminate the Purge. On the night of what should be the final Purge, a betrayal from within the government forces Barnes and Roan out onto the street where they must fight to survive the night.',
    backdrop: 'https://image.tmdb.org/t/p/original/a7V3ZXCDAk3P7GjpgfN0IInjh0r.jpg',
    genres: [
      {
        id: '63684b11ef05a840a058d1f7',
        title: 'Horror',
        gradient: 'aqua-splash'
      }
    ],
    actors: [
      {
        actorId: '63687338dcd1a9dc620a3bbf',
        name: 'Tom Holland',
        photo: 'https://image.tmdb.org/t/p/w780/bBRlrpJm9XkNSg0YT5LCaxqoFMX.jpg'
      }
    ]
  },
  currentMovieReviews: {
    total: 1,
    items: [
      {
        _id: '6368c3522bc63fa1e1b4cc66',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        rating: 4.5,
        approved: true,
        user: {
          fullname: 'User 1',
          userId: '636801c301a37899c5a6e33a'
        },
        postedAt: '2022-11-07T08:35:30.557Z'
      }
    ]
  },
};