import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ClipboardCopy } from '@patternfly/react-core';
import EventListenerURL from '../EventListenerURL';
import { useEventListenerURL } from '../../utils/triggers';
import {
  EventlistenerTestData,
  EventlistenerTypes,
} from '../../../../test-data/event-listener-data';

jest.mock('../../utils/triggers', () => ({ useEventListenerURL: jest.fn<string | null>() }));

type EventListenerURLProps = React.ComponentProps<typeof EventListenerURL>;

describe('EventListenerURL', () => {
  let wrapper: ShallowWrapper<EventListenerURLProps>;
  const mockEventListener = EventlistenerTestData[EventlistenerTypes.TRIGGER_REF];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return an empty render if a routeURL does not exist', () => {
    (useEventListenerURL as jest.Mock).mockReturnValueOnce(null);
    wrapper = shallow(
      <EventListenerURL eventListener={mockEventListener} namespace="test-namespace" />,
    );
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('should return render the URL if a routeURL exists', () => {
    (useEventListenerURL as jest.Mock).mockReturnValueOnce('test-URL');
    wrapper = shallow(
      <EventListenerURL eventListener={mockEventListener} namespace="test-namespace" />,
    );
    expect(wrapper.find(ClipboardCopy)).toBeTruthy();
  });
});
