import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
    marginBottom: theme.spacing(17)
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}));

function FlashCard() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        action={
          <div className={classes.headerControls}>
          <IconButton>
            <DeleteForeverIcon />
          </IconButton>
          <IconButton aria-label="Settings">
            <MoreVertIcon />
          </IconButton>
          </div>
        }
      />
      <CardContent>
        <Typography variant="h5" component="h2">
          η καρέκλα
        </Typography>
        <Divider className={classes.divider} />
        <Typography variant="body1" color="textSecondary" component="h3">
          Η καρέκλα ήταν τόσο βρώμικη που δεν ήθελα ούτε καν να κάτσω.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
        <Typography variant="h5" component="h2">
          the chair
        </Typography>
        <Divider className={classes.divider} />
        <Typography variant="body1" color="textSecondary" component="h3">
          The chair was so dirty that I didn't even sit down.
        </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default FlashCard;