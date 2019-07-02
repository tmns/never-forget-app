import React from "react";
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
import OfflineBolt from '@material-ui/icons/OfflineBolt';
import ApolloClient, { gql } from "apollo-boost";

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

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  credentials: "include"
});

const addDeckMutation = gql`
  mutation CreateNewDeck($input: NewDeckInput!) {
    newDeck(input: $input) {
      name
      description
    }
  }
`;

async function addDeck(variables) {
  return await client.mutate({ mutation: addDeckMutation, variables});
}

function Table(props) {
  const [state, setState] = React.useState(props.data);

  React.useEffect(() => {
    setState(props.data);
  }, [props.data]);

  return (
    <MaterialTable
      icons={tableIcons}
      title={props.title}
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
              
              // update database
              try {
                await addDeck({ 
                  input: {
                    name: newData.name, 
                    description: newData.description
                  }
                })
              }  catch(e) {
                console.log(e)
              }
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...state.data];
              data[data.indexOf(oldData)] = newData;
              setState({ ...state, data });
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...state.data];
              data.splice(data.indexOf(oldData), 1);
              setState({ ...state, data });
            }, 600);
          })
      }}
      actions={[
        {
          icon: OfflineBolt,
          tooltip: 'Study',
          onClick: (event, rowData) => console.log(event, rowData)
        },
        {
          icon: Search,
          tooltip: 'Browse',
          onClick: (event, rowData) => console.log(event, rowData)
        }
      ]}  
      options={{
        actionsColumnIndex: -1
      }}
    />
  );
}

export default Table;
