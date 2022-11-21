import React, { useCallback, useEffect, useState } from "react"
import { Icon, Label, Menu, Table } from "semantic-ui-react";
import * as userAPI from "../utils/api/user"
import { LeaderBoardResponse } from "../utils/api/user";

export default function LeaderBoardPage() {
    const [leaderBoard, setLeaderBoard] = useState<LeaderBoardResponse>();

    const getLeaderBoard = useCallback(async () => {
        const res = await userAPI.getLeaderBoard();
        setLeaderBoard(res.data);
    }, []);

    useEffect(() => {
        getLeaderBoard();
    }, [getLeaderBoard]);

    return (<Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>User email</Table.HeaderCell>
            <Table.HeaderCell>Wins</Table.HeaderCell>
            <Table.HeaderCell>Loses</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
    
        <Table.Body>
          {leaderBoard ? leaderBoard.data.map(user => <TableRow email={user.email} wins={user.wins} loses={user.loses} />) : ''}
        </Table.Body>
      </Table>)
}

interface TableRowProps {
    email: string;
    wins: number;
    loses: number;
}

const TableRow = ({email, wins, loses}: TableRowProps) => {
    return (
        <Table.Row>
        <Table.Cell>
          <Label>{email}</Label>
        </Table.Cell>
        <Table.Cell>{wins}</Table.Cell>
        <Table.Cell>{loses}</Table.Cell>
      </Table.Row>
    )
}