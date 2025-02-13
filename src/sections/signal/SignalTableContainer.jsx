// SignalTableContainer.jsx

import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Modal, Stack, Tooltip, Typography } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import SignalTable from 'sections/signal/SignalTable';
import FormSignalEditAdd from 'sections/signal/FormSignalEditAdd';
import AlertSignalDelete from 'sections/signal/AlertSignalDelete';
import ExpandingSignalDetail from 'sections/signal/ExpandingSignalDetail';
import { useGetSignalsByChannel } from 'api/signal';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';

export default function SignalTableContainer() {
  const { channelId } = useParams();

  // SWR hook
  const {
    signalsLoading,
    signals = [],
    signalsError,
    revalidateSignals
  } = useGetSignalsByChannel(channelId);

  // Local state for modals
  const [signalModal, setSignalModal] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [signalDeleteId, setSignalDeleteId] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Sanitize and map data for the table
  const sanitizedData = useMemo(() => {
    return signals.map((signal) => ({
      ...signal,
      allocation: signal.allocationPercentage ?? 'N/A',
      stopLoss: signal.stopLoss ?? 'N/A',
      takeProfit: signal.takeProfit ?? 'N/A',
      signalExpirationTime: signal.signalExpirationTime
        ? new Date(signal.signalExpirationTime).toLocaleString()
        : 'N/A',
      id: signal.id || `no-id-${Math.random()}`,
    }));
  }, [signals]);

  // Define table columns
  const columns = useMemo(
    () => [
      {
        header: 'Symbol',
        accessorKey: 'symbol',
        cell: ({ getValue }) => <Typography variant="subtitle1">{getValue()}</Typography>,
      },
      {
        header: 'Trade Type',
        accessorKey: 'tradeType',
        cell: ({ getValue }) => <Typography variant="body2">{getValue()}</Typography>,
      },
      {
        header: 'Asset Type',
        accessorKey: 'assetType',
        cell: ({ getValue }) => <Typography variant="body2">{getValue()}</Typography>,
      },
      {
        header: 'Buy/Sell',
        accessorKey: 'buyOrSell',
        cell: ({ getValue }) => <Typography variant="body2">{getValue()}</Typography>,
      },
      {
        header: 'Allocation',
        accessorKey: 'allocation',
        cell: ({ getValue }) => (
          <Typography variant="body2">
            {typeof getValue() === 'number' ? getValue() : 'N/A'}
          </Typography>
        ),
      },
      {
        header: 'Take Profit',
        accessorKey: 'takeProfit',
        cell: ({ getValue }) => (
          <Typography variant="body2">{getValue() !== 'N/A' ? getValue() : 'N/A'}</Typography>
        ),
      },
      {
        header: 'Stop Loss',
        accessorKey: 'stopLoss',
        cell: ({ getValue }) => (
          <Typography variant="body2">{getValue() !== 'N/A' ? getValue() : 'N/A'}</Typography>
        ),
      },
      {
        header: 'Signal Expiration Time',
        accessorKey: 'signalExpirationTime',
        cell: ({ getValue }) => <Typography variant="body2">{getValue()}</Typography>,
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <Tooltip title="View">
              <IconButton
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSignal(row.original);
                  setDetailModalOpen(true);
                }}
              >
                <EyeOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSignal(row.original);
                  setSignalModal(true);
                }}
              >
                <EditOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  setSignalDeleteId(row.original.id);
                }}
              >
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    []
  );

  // Handle loading and error states
  if (signalsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
        <CircularProgress />
      </Box>
    );
  }

  if (signalsError) {
    return (
      <Box p={2}>
        <Typography variant="h6" color="error">
          Error loading signals: {signalsError.message}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <SignalTable
        data={sanitizedData}
        columns={columns}
        modalToggler={() => {
          setSignalModal(true);
          setSelectedSignal(null);
        }}
      />

      {/* Alert for Deletion */}
      <AlertSignalDelete
        id={signalDeleteId}
        title={`Signal ${signalDeleteId}`}
        open={!!signalDeleteId}
        handleClose={async () => {
          setSignalDeleteId('');
          await revalidateSignals(); // Revalidate after delete
        }}
      />

      {/* Form for Editing/Adding */}
      <FormSignalEditAdd
        open={signalModal}
        modalToggler={(isOpen) => {
          setSignalModal(isOpen);
          // Optional: you can still revalidate on close, but the immediate re-fetch
          // in FormSignalEditAdd after create/update is often sufficient.
          if (!isOpen) {
            revalidateSignals();
          }
        }}
        signal={selectedSignal}
        channelId={channelId}
        revalidateSignals={revalidateSignals}
      />

      {/* Detail Modal */}
      <Modal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        aria-labelledby="signal-detail-modal-title"
        aria-describedby="signal-detail-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {selectedSignal && <ExpandingSignalDetail data={selectedSignal} />}
        </Box>
      </Modal>
    </>
  );
}
