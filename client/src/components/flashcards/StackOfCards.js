import React from 'react';
import { makeStyles, withStyles } from "@material-ui/core/styles";

import SingleCard from './SingleCard';
import { Container } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  stackContainer: {
    position: 'relative'
  },
  stack: {
    position : 'relative'
  }
}));

var cards = [
  {
    id: 3,
    prompt: "το καλοκαίρι",
    promptExample: "Περάσαμε όλο το καλοκαίρι μας σε ένα νισάκι εδώ   κοντά.",
    target: "the summer",
    targetExample: "We spent our entire summer on a nearby island."
  },
  {
    id: 4,
    prompt: "το καλοκαίρι",
    promptExample: "Περάσαμε όλο το καλοκαίρι μας σε ένα νισάκι εδώ   κοντά.",
    target: "the summer",
    targetExample: "We spent our entire summer on a nearby island."
  }
];

export default StackOfCards;