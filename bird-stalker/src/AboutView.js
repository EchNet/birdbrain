import React from 'react';

function AboutView() {
  return (
    <>
      <section>
        <h3>Hello, Birders!</h3>
        <p>
          <span className="logo">Bird Stalker</span> is a companion to
          the <a href="https://ebird.org" target="ebird">eBird website/app.</a>
        </p>
        <p>
          <ul>
            <li>
              Are you traveling and want to find out what interesting birds can be seen in the area?  
            </li>
            <li>
              Are you stalking a particular, elusive species and want to know where it has been seen lately?
              <br/>
            </li>
            <li>
              Are you just looking to add variety to your birding adventure?
            </li>
          </ul>
        </p>
        <p>
          eBird can answer your questions, but it takes a lot of clicking and typing!  (Or, poking and 
          swiping, depending on your tech preferences!)
        </p>
        <p>
          <span className="logo">Bird Stalker</span> aims to take the fuss out of our common obsession.
        </p>
      </section>
      <section>
        <h3>Feedback</h3>
        <p>
          Having trouble getting Bird Stalker to work right?
        </p>
        <p>
          Got an idea for improving Bird Stalker?
        </p>
        <p>
          Email us: <a href="mailto:birdstalker@ech.net" target="email">birdstalker@ech.net</a>
        </p>
      </section>
      <section>
        <h3>About Me</h3>
        <p>
          <a href="https://ebird.org/profile/NTIwNjcy" target="ebird">My eBird profile.</a>
        </p>
        <p>
          I like nature and getting outdoors. I like building software to simplify everyday complications.
        </p>
        <p>
          My passion for birding began at an early age, when the family bookcase held such classic
          Golden Guide Nature Pocket Guides as "Trees", "Stars", and "Rocks and Minerals", though none attracted
          the attention of this young reader as did "Birds".
        </p>
      </section>
      <section>
        <h3>Support Bird Stalker!</h3>
        <p>
          <a href="https://paypal.me/echnet" target="paypal">
            <div>
              <img src="/img/coffee.png" height="105"/>
              <br/>
              Buy me a coffee.
            </div>
          </a>
        </p>
      </section>
    </>
  );
}

export default AboutView;
