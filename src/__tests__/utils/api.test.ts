import MockDate from 'mockdate';
import {
  createActor,
  createGenre,
  createMovie,
  createUser,
  DataRoute,
  deleteActor,
  deleteGenre,
  deleteMovie,
  deleteUser,
  getActorInfo,
  getFavorites,
  getLoggedInUserData,
  getMovieInfo,
  getMovieReviews,
  getMoviesByGenre,
  loadData,
  login,
  logout,
  reviewApproval,
  submitReview,
  updateActor,
  updateFavorites,
  updateGenre,
  updateMovie,
  updateUser,
  validateEmailFromApi
} from "../../utils/api";

jest.mock("../../redux/models");
jest.mock("../../utils/helpers");

beforeEach(() => {
  MockDate.set(new Date());
});

afterEach(() => {
  MockDate.reset();
});

describe("login", () => {
  it("should expose a function", () => {
    expect(login).toBeDefined();
  });

  it("login should return expected output", async () => {
    const retValue = await login("admin@email.com", "123");
    expect(retValue.success).toBeTruthy();
  });
});
describe("logout", () => {
  it("should expose a function", () => {
    expect(logout).toBeDefined();
  });

  it("logout should return expected output", async () => {
    const retValue = await logout();
    expect(retValue).toBeFalsy();
  });
});
describe("loadData", () => {
  it("should expose a function", () => {
    expect(loadData).toBeDefined();
  });

  it("loadData should return expected output", async () => {
    const retValue = await loadData(DataRoute.Actors, {});
    expect(retValue.success).toBeTruthy();
  });
});
describe("updateUser", () => {
  it("should expose a function", () => {
    expect(updateUser).toBeDefined();
  });

  it("updateUser should return expected output", async () => {
    const retValue = await updateUser('123', { fullname: 'test' });
    expect(retValue.success).toBeTruthy();
  });
});
describe("createUser", () => {
  it("should expose a function", () => {
    expect(createUser).toBeDefined();
  });

  it("createUser should return expected output", async () => {
    const retValue = await createUser({ fullname: 'test' });
    expect(retValue.success).toBeTruthy();
  });
});
describe("deleteUser", () => {
  it("should expose a function", () => {
    expect(deleteUser).toBeDefined();
  });

  it("deleteUser should return expected output", async () => {
    const retValue = await deleteUser('123');
    expect(retValue.success).toBeTruthy();
  });
});
describe("updateActor", () => {
  it("should expose a function", () => {
    expect(updateActor).toBeDefined();
  });

  it("updateActor should return expected output", async () => {
    const retValue = await updateActor('123', {});
    expect(retValue.success).toBeTruthy();
  });
});
describe("createActor", () => {
  it("should expose a function", () => {
    expect(createActor).toBeDefined();
  });

  it("createActor should return expected output", async () => {
    const retValue = await createActor({});
    expect(retValue.success).toBeTruthy();
  });
});
describe("deleteActor", () => {
  it("should expose a function", () => {
    expect(deleteActor).toBeDefined();
  });

  it("deleteActor should return expected output", async () => {
    const retValue = await deleteActor('123');
    expect(retValue.success).toBeTruthy();
  });
});
describe("updateMovie", () => {
  it("should expose a function", () => {
    expect(updateMovie).toBeDefined();
  });

  it("updateMovie should return expected output", async () => {
    const retValue = await updateMovie('123', {});
    expect(retValue.success).toBeTruthy();
  });
});
describe("createMovie", () => {
  it("should expose a function", () => {
    expect(createMovie).toBeDefined();
  });

  it("createMovie should return expected output", async () => {
    const retValue = await createMovie({});
    expect(retValue.success).toBeTruthy();
  });
});
describe("deleteMovie", () => {
  it("should expose a function", () => {
    expect(deleteMovie).toBeDefined();
  });

  it("deleteMovie should return expected output", async () => {
    const retValue = await deleteMovie('123');
    expect(retValue.success).toBeTruthy();
  });
});
describe("updateGenre", () => {
  it("should expose a function", () => {
    expect(updateGenre).toBeDefined();
  });

  it("updateGenre should return expected output", async () => {
    const retValue = await updateGenre('123', {});
    expect(retValue.success).toBeTruthy();
  });
});
describe("createGenre", () => {
  it("should expose a function", () => {
    expect(createGenre).toBeDefined();
  });

  it("createGenre should return expected output", async () => {
    const retValue = await createGenre({});
    expect(retValue.success).toBeTruthy();
  });
});
describe("deleteGenre", () => {
  it("should expose a function", () => {
    expect(deleteGenre).toBeDefined();
  });

  it("deleteGenre should return expected output", async () => {
    const retValue = await deleteGenre('123');
    expect(retValue.success).toBeTruthy();
  });
});
describe("reviewApproval", () => {
  it("should expose a function", () => {
    expect(reviewApproval).toBeDefined();
  });

  it("reviewApproval should return expected output", async () => {
    const retValue = await reviewApproval('123', { approved: true });
    expect(retValue.success).toBeTruthy();
  });
});
describe("getActorInfo", () => {
  it("should expose a function", () => {
    expect(getActorInfo).toBeDefined();
  });

  it("getActorInfo should return expected output", async () => {
    const retValue = await getActorInfo('123');
    expect(retValue.success).toBeTruthy();
  });
});
describe("getMovieInfo", () => {
  it("should expose a function", () => {
    expect(getMovieInfo).toBeDefined();
  });

  it("getMovieInfo should return expected output", async () => {
    const retValue = await getMovieInfo('123');
    expect(retValue.success).toBeTruthy();
  });
});
describe("getMovieReviews", () => {
  it("should expose a function", () => {
    expect(getMovieReviews).toBeDefined();
  });

  it("getMovieReviews should return expected output", async () => {
    const retValue = await getMovieReviews('123', {});
    expect(retValue.success).toBeTruthy();
  });
});
describe("submitReview", () => {
  it("should expose a function", () => {
    expect(submitReview).toBeDefined();
  });

  it("submitReview should return expected output", async () => {
    const retValue = await submitReview({});
    expect(retValue.success).toBeTruthy();
  });
});
describe("getMoviesByGenre", () => {
  it("should expose a function", () => {
    expect(getMoviesByGenre).toBeDefined();
  });

  it("getMoviesByGenre should return expected output", async () => {
    const retValue = await getMoviesByGenre('123');
    expect(retValue.success).toBeTruthy();
  });
});
describe("updateFavorites", () => {
  it("should expose a function", () => {
    expect(updateFavorites).toBeDefined();
  });

  it("updateFavorites should return expected output", async () => {
    const retValue = await updateFavorites({
      movieId: '123',
      userId: '',
      isFavorite: false
    });
    expect(retValue.success).toBeTruthy();
  });
});
describe("getFavorites", () => {
  it("should expose a function", () => {
    expect(getFavorites).toBeDefined();
  });

  it("getFavorites should return expected output", async () => {
    const retValue = await getFavorites('123');
    expect(retValue.success).toBeTruthy();
  });
});
describe("getLoggedInUserData", () => {
  it("should expose a function", () => {
    expect(getLoggedInUserData).toBeDefined();
  });

  it("getLoggedInUserData should return expected output", async () => {
    const retValue = await getLoggedInUserData();
    expect(retValue.success).toBeTruthy();
  });
});
describe("validateEmailFromApi", () => {
  it("should expose a function", () => {
    expect(validateEmailFromApi).toBeDefined();
  });

  it("validateEmailFromApi should return expected output", async () => {
    const retValue = await validateEmailFromApi('test@email.com', '123');
    expect(retValue.success).toBeTruthy();
  });
});
