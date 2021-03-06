import {
  Button,
  CircularProgress,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { BotSettings } from '../../models';
import { SensetiveTextField } from '..';

export interface BotSettingsTableProps {
  botSettings?: Partial<BotSettings>;
  updateSettings: (settings: Omit<Partial<BotSettings>, 'id'>) => void;
  loading?: boolean;
  onImportingClick?: () => void;
}

export const BotSettingsTable: React.FC<BotSettingsTableProps> = (props) => {
  const { botSettings, updateSettings, loading, onImportingClick } = props;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography>Bot Token</Typography>
            </TableCell>
            <TableCell width="80%">
              {loading ? (
                <CircularProgress size="1.5rem" color="primary" />
              ) : (
                <SensetiveTextField
                  onChange={(e) => updateSettings({ token: e.target.value })}
                  value={botSettings?.token ?? ''}
                  fullWidth
                />
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>Webhook host and path</Typography>
            </TableCell>
            <TableCell width="80%">
              {loading ? (
                <CircularProgress size="1.5rem" color="primary" />
              ) : (
                <TextField
                  value={botSettings?.webhookHost ?? ''}
                  onChange={(e) =>
                    updateSettings({ webhookHost: e.target.value })
                  }
                  fullWidth
                />
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>Is bot enabled?</Typography>
            </TableCell>
            <TableCell width="80%">
              {loading ? (
                <CircularProgress size="1.5rem" color="primary" />
              ) : (
                <Switch
                  checked={botSettings?.isEnabled ?? false}
                  onChange={(_e, checked) =>
                    updateSettings({ isEnabled: checked })
                  }
                  color="primary"
                />
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>Imports</Typography>
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="secondary"
                disabled={botSettings?.isImporting}
                onClick={onImportingClick}>
                Start importing procedure
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
