import {registerBlockType} from '@wordpress/blocks';
import {TextControl, Placeholder, Spinner} from '@wordpress/components';
import {useBlockProps, InspectorControls} from '@wordpress/block-editor';
import {useState, useEffect} from '@wordpress/element';
import metadata from './../block.json';

const parseSnapData = (snapData) => {
    let snap = {
        html: "<div>No snap url provided</div>",
    };
    if (snapData) {
        try {
            snap = JSON.parse(snapData);
        } catch {
            snap = snapData;
        }
    }

    return snap;
}

registerBlockType('snappify/block', {
    ...metadata,
    icon: {
        src: <svg width="50" height="40" viewBox="0 0 951 754" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="951" height="754" rx="60" fill="#252525"/>
            <path d="M0 60C0 26.8629 26.8629 0 60 0H891C924.137 0 951 26.8629 951 60V215H0V60Z" fill="#323232"/>
            <circle cx="118" cy="114" r="39" fill="#FF5F57"/>
            <circle cx="234" cy="114" r="39" fill="#FEBC2E"/>
            <circle cx="352" cy="114" r="39" fill="#28C840"/>
            <path
                d="M250.715 421.158L391.151 344.639C395.815 342.097 401.5 345.474 401.5 350.786V382.956C401.5 386.672 399.439 390.082 396.148 391.81L304.939 439.695C303.499 440.451 303.515 442.518 304.967 443.251L396.008 489.226C399.376 490.927 401.5 494.379 401.5 498.153V530.347C401.5 535.628 395.875 539.007 391.212 536.526L250.803 461.821C247.539 460.085 245.5 456.69 245.5 452.993V429.939C245.5 426.278 247.501 422.91 250.715 421.158Z"
                fill="white"/>
            <path
                d="M701.785 421.158L561.349 344.639C556.685 342.097 551 345.474 551 350.786V382.956C551 386.672 553.061 390.082 556.352 391.81L647.561 439.695C649.001 440.451 648.985 442.518 647.533 443.251L556.492 489.226C553.124 490.927 551 494.379 551 498.153V530.347C551 535.628 556.625 539.007 561.288 536.526L701.697 461.821C704.961 460.085 707 456.69 707 452.993V429.939C707 426.278 704.999 422.91 701.785 421.158Z"
                fill="white"/>
            <script xmlns="" id="bw-fido2-page-script"/>
        </svg>,
    },
    attributes: {
        url: {
            type: 'string',
            default: ''
        },
        snapData: {
            type: 'string',
            default: ''
        }
    },

    edit: ({attributes, setAttributes}) => {
        const blockProps = useBlockProps();
        const [isLoading, setIsLoading] = useState(false);

        const fetchData = async () => {
            if (!attributes.url) {
                setAttributes({snapData: ''});
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/wp-json/snappify/fetch/?snap=${attributes.url}`);
                if (!response.ok) {
                    throw new Error('Error fetching snap');
                }
                const data = await response.json();
                setAttributes({snapData: data});
            } catch (error) {
                console.error('Fetch error:', error);
                setAttributes({snapData: 'Error fetching data'});
            }
            setIsLoading(false);
        };

        useEffect(() => {
            fetchData();
        }, [attributes.url]);

        const snap = parseSnapData(attributes.snapData);

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <TextControl
                        label="Public Snap URL"
                        value={attributes.url}
                        onChange={(url) => setAttributes({url})}
                    />
                </InspectorControls>
                <div>
                    {isLoading ? <Spinner/> : <div dangerouslySetInnerHTML={{__html: snap.html}}/>}
                </div>
            </div>
        );
    },

    save: ({attributes}) => {
        const snap = parseSnapData(attributes.snapData);

        return (
            <div dangerouslySetInnerHTML={{__html: snap.html}}/>
        );
    },
});
