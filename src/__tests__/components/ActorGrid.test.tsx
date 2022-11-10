import { render, screen } from "@testing-library/react";
import { ActorGrid, ActorThumbnail } from "../../components/actor_thumbnails/ActorGrid";
import { withRouter } from "../../utils/test-utils";

describe("ActorGrid Components", () => {
  test("should render the actor thumbnail", async () => {
    const actorData = {
      actorId: '123',
      image: 'https://storage.googleapis.com/poc-app-3eca2.appspot.com/Frame%2011844e325ad3.png',
      name: 'Test Actor'
    };

    render(withRouter(ActorThumbnail, { path: '/', route: '/' }, actorData));
    expect(screen.getByText(actorData.name)).toBeInTheDocument();
  });

  test("should render a list of actors in a grid", async () => {
    const actors = [
      {
        actorId: '123',
        image: 'https://storage.googleapis.com/poc-app-3eca2.appspot.com/Frame%2011844e325ad3.png',
        name: 'Test Actor'
      },
      {
        actorId: '456',
        image: 'https://storage.googleapis.com/poc-app-3eca2.appspot.com/Frame%2011844e325ad3.png',
        name: 'Test Actor 2'
      },
      {
        actorId: '789',
        image: 'https://storage.googleapis.com/poc-app-3eca2.appspot.com/Frame%2011844e325ad3.png',
        name: 'Test Actor 3'
      }
    ];

    render(withRouter(ActorGrid, { path: '/', route: '/' }, { actors }));

    for (const actor of actors) {
      expect(screen.getByText(actor.name)).toBeInTheDocument();
    }
  });
});