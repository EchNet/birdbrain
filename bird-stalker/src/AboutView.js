import React from 'react';

const ICON_SIZE = 25;

function icon(name) {
  return <img src={`/img/${name}.svg`} width={ICON_SIZE} height={ICON_SIZE} alt={name}/>;
}


function AboutView() {
  return (
    <>
      <section>
        <h3>
          {icon("hand-regular")}
          Hello, Birders!
          {icon("crow-solid")}
        </h3>
        <p>
          Use <span className="logo">Bird Stalker</span> to track down bird species in
          your area, based on sightings reported to <a href="https://ebird.org"><b>eBird</b></a>.
        </p>
        <ul>
          <li>
            On the road and want to find out what interesting birds can be seen in the area?  
          </li>
          <li>
            Stalking a particular, elusive species and want to know where it has been seen lately?
            <br/>
          </li>
          <li>
            Just looking to add variety to your birding adventure?
          </li>
        </ul>
        <p>
          eBird can answer your questions, but it takes a lot of clicking and typing (or poking and 
          swiping, depending on your device!)
        </p>
        <p>
          <span className="logo">Bird Stalker</span> takes the fuss out of our common obsession.
          {" "}<a href="/">Let's get started!</a>
        </p>
      </section>
      <section>
        <h3>
          {icon("circle-question-solid")}
          Feedback
          {icon("glasses-solid")}
        </h3>
        <p>
          Got an idea for improving Bird Stalker?
        </p>
        <p>
          Email us: <a href="mailto:birdstalker@ech.net" target="email">birdstalker@ech.net</a>
        </p>
      </section>
      <section>
        <h3>
          {icon("earlybirds")}
          About Me
          {icon("binoculars-solid")}
        </h3>
        <p>
          See <a href="https://ebird.org/profile/NTIwNjcy" target="ebird">my eBird profile.</a>
        </p>
        <p>
          I like nature and getting outdoors. While indoors, I like to build software to simplify everyday
          complications.
        </p>
        <p>
          My passion for birding began at an early age, when the family bookcase held such classic
          Golden Guide Nature Pocket Guides as "Trees", "Stars", and "Rocks and Minerals", though none attracted
          the attention of this young reader as did "Birds".
        </p>
      </section>
      <section>
        <h3>
          {icon("award-solid")}
          Support Bird Stalker
          {icon("camera-solid")}
        </h3>
        <p className="text-center">
          <a href="https://paypal.me/echnet" target="paypal">
            <img src="/img/coffee.png" height="105" alt="Buy me a coffee"/>
            <br/>
            Buy me a coffee!
          </a>
        </p>
      </section>
    </>
  );
}

export default AboutView;
