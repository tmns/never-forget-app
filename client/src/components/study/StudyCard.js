import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
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

  function handleNoClick() {
    setExpanded(false);
    // do logic for NOT remembering

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

  function handleYesClick() {
    setExpanded(false);
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
