import PropTypes from 'prop-types';

// material-ui
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// third-party
import { useDraggable, useDroppable } from '@dnd-kit/core';

// project-import
import IconButton from 'components/@extended/IconButton';

// assets
import DragOutlined from '@ant-design/icons/DragOutlined';

// ==============================|| DRAGGABLE ROW ||============================== //

export default function DraggableRow({ row, children }) {
  const { setNodeRef: setDropRef, isOver: isOverCurrent } = useDroppable({
    id: `row-${row.id}`
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging
  } = useDraggable({
    id: `row-${row.id}`
  });

  return (
    <TableRow ref={setDropRef} sx={{ opacity: isDragging ? 0.5 : 1, bgcolor: isOverCurrent ? 'primary.lighter' : 'inherit' }}>
      <TableCell>
        <IconButton
          ref={setDragRef}
          {...listeners}
          {...attributes}
          size="small"
          sx={{ p: 0, width: 24, height: 24, fontSize: '1rem', mr: 0.75 }}
          color="secondary"
          disabled={row.getIsGrouped()}
        >
          <DragOutlined />
        </IconButton>
      </TableCell>
      {children}
    </TableRow>
  );
}

DraggableRow.propTypes = { row: PropTypes.object, reorderRow: PropTypes.func, children: PropTypes.node };
