import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ms from "ms";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import Divider from "@material-ui/core/Divider";
import { Tooltip } from "@material-ui/core";

import client from "../../apollo/client";
import { updateCardProgress, cardsQueryNextReview } from "../../apollo/card";

const useStyles = makeStyles(theme => ({
  header: {
    paddingBottom: "0"
  },
  card: {
    display: "flex",
    flexDirection: "column",
    minWidth: 345,
    maxWidth: 345,
    marginBottom: theme.spacing(17)
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  hide: {
    display: "none"
  }
}));

const StyledActions = withStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "5px"
  },
  spacing: {
    "& > * + *": {
      marginLeft: 8
    }
  }
})(CardActions);

// helper function to calculate new progress values of card
// ie, update review date and interval progres
function getNewProgressValues(score, intervalProgress, now) {
  var intervals = [2, 4, 6, 16, 34];
  var scoreToIntervalChange = [-3, 1];

  var knewImmediately = false;
  if (score == scoreToIntervalChange.length - 1) {
    knewImmediately = true;
  }

  var nextReview = now + 2;
  if (knewImmediately) {
    if (intervalProgress < intervals.length) {
      nextReview = now + intervals[intervalProgress];
    } else if (intervalProgress >= intervals.length) {
      nextReview =
        now +
        intervals.slice(-1) * (intervalProgress + 1 - intervals.length) * 2;
    }
  }

  let newIntervalProgress = intervalProgress + scoreToIntervalChange[score];
  if (newIntervalProgress < 0) {
    newIntervalProgress = 0;
  }

  return {
    nextReview,
    newIntervalProgress
  };
}

async function updateProgress(card, score, deckId) {
  // calculate new progress values
  let now = Math.floor(new Date().getTime() / ms("1h"));
  let { nextReview, newIntervalProgress } = getNewProgressValues(
    score,
    card.intervalProgress,
    now
  );

  // calculate next time string for ui display
  // let nextTime = nextReview - now;
  // let nextTimeString = `${nextTime} hours`;
  // if (nextTime > 24) {
  //   nextTimeString = `${Math.floor(nextTime / 24)} day(s)`;
  // }
  // Do something with nextTimeString (eg display to user)

  // attempt to update card progress values in db
  try {
    let data = {
      prompt: card.prompt,
      nextReview,
      newIntervalProgress
    };
    await updateCardProgress(data, deckId);
  } catch (e) {
    console.log(e);
  }
}

function StudyCard(props) {
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);

  const [session, setSession] = React.useState({
    cards: props.cards,
    reviewFinished: false
  });

  async function getNextReviewTime() {
    var data = await client.query({
      query: cardsQueryNextReview,
      variables: { deckId: props.deckId },
      fetchPolicy: "no-cache"
    });

    var nextReviewTime = data.data.cards.reduce((acc, card) => {
      acc = card.nextReview < acc ? card.nextReview : acc;
      return acc;
    }, data.data.cards[0].nextReview);

    let now = Math.floor(new Date().getTime() / ms("1h"));
    let nextReviewFromNow = nextReviewTime - now;
    return nextReviewFromNow;
  }

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  function handleAnswerClick(answer = 0) {
    return async function handleAnswer() {
      setExpanded(false);

      var currentCard = session.cards[0];

      // if not demo cards on landing page
      if (!props.demo) {
        props.setNumCards(props.numCards - 1);
      }

      // we delay here so the answer isnt revealed as the expansion closes
      setTimeout(async () => {
        if (session.cards.length > 1) {
          setSession({
            ...session,
            cards: session.cards.slice(1)
          });
          if (!props.demo) {
            // attempt to update progress values
            await updateProgress(currentCard, answer, props.deckId);
          }
        } else {
          let nextReviewTime;
          let nextReviewTimeString;
          if (!props.demo) {
            await updateProgress(currentCard, answer, props.deckId);
            nextReviewTime = await getNextReviewTime();
            if (nextReviewTime > 24) {
              nextReviewTime = Math.floor(nextReviewTime / 24);
              nextReviewTimeString = `${nextReviewTime} ${
                nextReviewTime == 1 ? "day" : "days"
              }`;
            } else {
              nextReviewTimeString = `${nextReviewTime} ${
                nextReviewTime == 1 ? "hour" : "hours"
              }`;
            }
          } else {
            nextReviewTimeString = "2 hours"; // arbitrary example next review time
          }
          setSession({
            reviewFinished: true,
            cards: [
              {
                prompt: "All cards reviewed!",
                promptExample: `Great job! You have reviewed all the cards for this deck. Check back in ${nextReviewTimeString} for another review!`
              }
            ]
          });
        }
      }, 250);
    };
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {session.cards[0].prompt}
        </Typography>
        <Divider className={classes.divider} />
        <Typography variant="body1" color="textSecondary" component="h3">
          {session.cards[0].promptExample}
        </Typography>
      </CardContent>
      <div className={session.reviewFinished ? classes.hide : ""}>
        <StyledActions>
          <Tooltip title="This was hard!">
            <IconButton aria-label="Mark hard" onClick={handleAnswerClick(0)}>
              <ThumbDown />
            </IconButton>
          </Tooltip>
          <Tooltip title="Show Answer">
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="Show target"
            >
              <ExpandMoreIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="This was easy!">
            <IconButton aria-label="Mark easy" onClick={handleAnswerClick(1)}>
              <ThumbUp />
            </IconButton>
          </Tooltip>
        </StyledActions>
      </div>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="h5" component="h2">
            {session.cards[0].target}
          </Typography>
          <Divider className={classes.divider} />
          <Typography variant="body1" color="textSecondary" component="h3">
            {session.cards[0].targetExample}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default StudyCard;
