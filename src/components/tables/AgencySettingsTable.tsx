import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import { Agency } from '../../models';
import { SensetiveTextField } from '..';

export interface AgencySettingsTableProps {
  agency: Partial<Agency>;
  loading?: boolean;
  updateAgency: (agency: Partial<Agency>) => void;
}

export const AgencySettingsTable: React.FC<AgencySettingsTableProps> = (
  props,
) => {
  const { agency, loading, updateAgency } = props;
  const theme = useTheme();

  return (
    <TableContainer component={Paper} style={{ margin: theme.spacing(3, 0) }}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography>Name</Typography>
            </TableCell>
            <TableCell width="80%">
              {loading ? (
                <CircularProgress size="1.5rem" color="primary" />
              ) : (
                <TextField
                  value={agency?.name ?? ''}
                  onChange={(e) => updateAgency({ name: e.target.value })}
                  fullWidth
                />
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>Description</Typography>
            </TableCell>
            <TableCell width="80%">
              {loading ? (
                <CircularProgress size="1.5rem" color="primary" />
              ) : (
                <TextField
                  value={agency?.description ?? ''}
                  onChange={(e) =>
                    updateAgency({ description: e.target.value })
                  }
                  fullWidth
                />
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>Registration key</Typography>
            </TableCell>
            <TableCell width="80%">
              {loading ? (
                <CircularProgress size="1.5rem" color="primary" />
              ) : (
                <SensetiveTextField
                  onChange={(e) =>
                    updateAgency({ registrationKey: e.target.value })
                  }
                  value={agency?.registrationKey ?? ''}
                  fullWidth
                />
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>Import url</Typography>
            </TableCell>
            <TableCell width="80%">
              {loading ? (
                <CircularProgress size="1.5rem" color="primary" />
              ) : (
                <SensetiveTextField
                  onChange={(e) => updateAgency({ importUrl: e.target.value })}
                  value={agency?.importUrl ?? ''}
                  fullWidth
                />
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
