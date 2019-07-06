import React from "react";
import ms from 'ms';
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import OfflineBolt from "@material-ui/icons/OfflineBolt";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CustomTheme from "../layout/CustomTheme";
import client from "../../apollo/client";

import { 
  addDeck, 
  removeDeck, 
  getDeckId,
  updateDeckInDB
} from "../../apollo/deck";

import { 
  cardsQuery,
  addCard,
  updateCardInDB,
} from "../../apollo/card";

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: FilterList,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: ArrowUpward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};

const useStyles = makeStyles(theme => ({
  button: {
    color: CustomTheme.palette.secondary.main,
    fontSize: "17px",
    "&:hover": {
      color: CustomTheme.palette.secondary.dark,
      backgroundColor: CustomTheme.palette.primary.main
    }
  },
  input: {
    display: "none"
  }
}));

function Table(props) {
  const classes = useStyles();
  
  const [state, setState] = React.useState(props.data);

  React.useEffect(() => {
    setState(props.data);
  }, [props.data]);
  
  const [isBrowsingCardsState, setIsBrowsingCardsState] = React.useState(false);

  var isActionHidden = isBrowsingCardsState;

  return (
    <React.Fragment>
      {isBrowsingCardsState == true && (
        <div
          onClick={() => {
            setIsBrowsingCardsState(false);
            setState(props.data);
          }}
        >
          <IconButton className={classes.button}>
            <ArrowBackOutlinedIcon /> Return to decks
          </IconButton>
        </div>
      )}
      <MaterialTable
        icons={tableIcons}
        title={state.title}
        columns={state.columns}
        data={state.data}
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(async () => {
                resolve();
                const data = [...state.data];
                data.push(newData);
                setState({ ...state, data });

                // add deck to database
                try {
                  if (!isBrowsingCardsState) {
                    await addDeck({
                      input: {
                        name: newData.name,
                        description: newData.description
                      }
                    });  
                  } else {
                    let now = Math.floor(new Date().getTime() / ms('1h'));
                    await addCard({
                      input: {
                        prompt: newData.prompt,
                        target: newData.target,
                        promptExample: newData.promptExample,
                        targetExample: newData.targetExample,
                        timeAdded: now,
                        nextReview: now,
                        intervalProgress: 0,
                        deckId: state.deckId
                      }
                    })
                  }
                } catch (e) {
                  console.log(e);
                }
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(async () => {

                resolve();
                const data = [...state.data];
                data[data.indexOf(oldData)] = newData;
                setState({ ...state, data });

                if (!isBrowsingCardsState) {
                  await updateDeckInDB(oldData, newData);
                } else {
                  await updateCardInDB(oldData, newData, state.deckId);
                }
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(async () => {
                resolve();
                const data = [...state.data];
                data.splice(data.indexOf(oldData), 1);
                setState({ ...state, data });

                // remove deck fom database
                var id = await getDeckId(oldData.name);
                var variables = { id };
                try {
                  await removeDeck(variables);
                } catch (e) {
                  console.log(e);
                }
              }, 600);
            })
        }}
        actions={[
          {
            icon: OfflineBolt,
            tooltip: "Study",
            hidden: isActionHidden,
            onClick: (event, rowData) => console.log(event, rowData)
          },
          {
            icon: Search,
            tooltip: "Browse",
            hidden: isActionHidden,
            onClick: async (event, rowData) => {
              var deckId = await getDeckId(rowData.name);
              var variables = { deckId };
              var data = await client.query({
                query: cardsQuery,
                variables,
                fetchPolicy: "no-cache"
              });
              var cards = data.data.cards;
              var cardData = {
                title: `Cards in ${rowData.name}`,
                columns: [
                  { title: "Prompt", field: "prompt" },
                  { title: "Target", field: "target" },
                  { title: "Prompt Example", field: "promptExample" },
                  { title: "Target Example", field: "targetExample" }
                ],
                data: cards,
                deckId
              };
              setIsBrowsingCardsState(true);
              setState(cardData);
            }
          }
        ]}
        options={{
          actionsColumnIndex: -1
        }}
      />
    </React.Fragment>
  );
}

export default Table;
