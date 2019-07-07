import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ms from "ms";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Divider from "@material-ui/core/Divider";
import { Tooltip } from "@material-ui/core";

import { updateCardProgress } from "../../apollo/card";

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
  let nextTime = nextReview - now;
  let nextTimeString = `${nextTime} hours`;
  if (nextTime > 24) {
    nextTimeString = `${Math.floor(nextTime / 24)} day(s)`;
  }
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

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  async function handleNoClick() {
    setExpanded(false);

    // if not demo cards on landing page
    if (!props.demo) {
      props.setNumCards(props.numCards - 1);

      // attempt to update progress values
      await updateProgress(session.cards[0], 0, props.deckId);
    }

    // we delay here so the answer isnt revealed as the expansion closes
    setTimeout(() => {
      if (session.cards.length > 1) {
        setSession({
          ...session,
          cards: session.cards.slice(1)
        });
      } else {
        setSession({
          reviewFinished: true,
          cards: [
            {
              prompt: "All cards reviewed!",
              promptExample:
                "Great job! You have reviewed all the cards for this deck. Check back soon for another review!"
            }
          ]
        });
      }
    }, 250);
  }

  async function handleYesClick() {
    setExpanded(false);
    if (!props.demo) {
      props.setNumCards(props.numCards - 1);

      // attempt to update progress values
      await updateProgress(session.cards[0], 1, props.deckId);
    }
    // do logic for remembering

    setTimeout(() => {
      if (session.cards.length > 1) {
        setSession({
          ...session,
          cards: session.cards.slice(1)
        });
      } else {
        setSession({
          reviewFinished: true,
          cards: [
            {
              prompt: "All cards reviewed!",
              promptExample:
                "Great job! You have reviewed all the cards for this deck. Check back soon for another review!"
            }
          ]
        });
      }
    }, 250);
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        action={
          <IconButton aria-label="Settings">
            <MoreVertIcon />
          </IconButton>
        }
      />
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
            <IconButton
              aria-label="Mark not remembered"
              onClick={handleNoClick}
            >
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
            <IconButton aria-label="Mark remembered" onClick={handleYesClick}>
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
