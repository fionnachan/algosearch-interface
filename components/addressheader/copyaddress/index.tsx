import { Button } from '@mui/material';
import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

const CopyAddress = (props) => {
	const [copied, setCopied] = useState(false);

	const copyAddress = () => {
		navigator.clipboard.writeText(props.address);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	return (
		props.address !== '' &&
      <Button className={props.className} onClick={copyAddress} size="small" aria-label="copy">
        {copied ? (
          <CheckIcon fontSize="small"/>
        ) : (
          <ContentCopyIcon fontSize="small"/>
        )}
      </Button>
	);
}

export default CopyAddress;
