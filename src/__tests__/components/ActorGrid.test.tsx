import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router, Routes } from "react-router-dom";
import { ActorThumbnail } from "../../components/actor_thumbnails/ActorGrid";

describe("ActorGrid Components", () => {
  const history = createMemoryHistory();

  test("should render the actor thumbnail", async () => {
    const actorData = {
      actorId: '123',
      image: 'https://storage.googleapis.com/poc-app-3eca2.appspot.com/Frame%2011844e325ad3.png',
      name: 'Test Actor'
    };

    render(
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route path="/" element={<ActorThumbnail {...actorData} />} />
        </Routes>
      </Router>
    );
    expect(screen.getByText(actorData.name)).toBeInTheDocument();
  });
});