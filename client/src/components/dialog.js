import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

const DialogTemplate  = props => // {title,text,type,onClose,open,handleCancel,handleConfirmation,cancelLabel,confirmationLabel}
	<Dialog dir='rtl'
		open={props.open}
		onClose={props.onClose}
	>
		<DialogTitle>{props.title}</DialogTitle>
		<DialogContent>
			<DialogContentText>
				{props.text}
			</DialogContentText>
		</DialogContent>
		{props.type === 'confirmation' && <DialogActions>
          <Button onClick={props.handleCancel || props.onClose} color="secondary">
            {props.cancelLabel|| 'ביטול'}
          </Button>
          <Button onClick={props.handleConfirmation} color="primary">
            {props.confirmationLabel || 'אישור'}
          </Button>
        </DialogActions>}
	</Dialog>

export default DialogTemplate;