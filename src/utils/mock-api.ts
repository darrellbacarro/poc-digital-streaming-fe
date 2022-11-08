import { rest } from "msw";
import { setupServer } from "msw/node";

const BASE_URL = "http://localhost:3000";

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
              plot: "Supervillains Harley Quinn, Bloodsport, Peacemaker and a collection of nutty cons at Belle Reve prison join the super-secret, super-shady Task Force X as they are dropped off at the remote, enemy-infused island of Corto Maltese.",
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
              plot: "Demons that once almost destroyed the world, are revived by someone. To prevent the world from being destroyed, the demon has to be sealed and the only one who can do it is the shrine maiden Shion from the country of demons, who has two powers; one is sealing demons and the other is predicting the deaths of humans. This time Naruto's mission is to guard Shion, but she predicts Naruto's death. The only way to escape it, is to get away from Shion, which would leave her unguarded, then the demon, whose only goal is to kill Shion will do so, thus meaning the end of the world. Naruto decides to challenge this \"prediction of death.\"",
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
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNjgwMWMzMDFhMzc4OTljNWE2ZTMzYSIsImVtYWlsIjoidXNlcjFAZW1haWwuY29tIiwiaWF0IjoxNjY3ODgyMTE4LCJleHAiOjE2Njc5MDM3MTh9.DiiLNEIEiPHAYAyTt6h85jBrBKb0yS3Ly7LGsT76UJU",
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
    const { fullname } = await req.json();
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
              bio: "Logan Wade Lerman is an American actor. He is known for playing the title role in the fantasy-adventure Percy Jackson films. He appeared in commercials in the mid-1990s, before starring in the series Jack & Bobby and the movies The Butterfly Effect and Hoot.",
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
  })
);
