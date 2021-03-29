import * as React from 'react';
import { Route, RouteComponentProps, Switch, Link } from 'react-router-dom';
import { Alert, PageSection } from '@patternfly/react-core';
import { DynamicImport } from '@app/DynamicImport';
import { accessibleRouteChangeHandler } from '@app/utils/utils';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { NotFound } from '@app/NotFound/NotFound';
// import { Openshift } from '@app/Openshift/Openshift';
// import { Reports } from '@app/Reports/Reports'

import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { LastLocationProvider, useLastLocation } from 'react-router-last-location';


import { ProjectDetail } from '@app/project_page/project_detail';




let routeFocusTimer: number;

const getSupportModuleAsync = () => () => import(/* webpackChunkName: 'support' */ '@app/Support/Support');

const Support = (routeProps: RouteComponentProps) => {
  const lastNavigation = useLastLocation();
  return (
    /* eslint-disable @typescript-eslint/no-explicit-any */
    <DynamicImport load={getSupportModuleAsync()} focusContentAfterMount={lastNavigation !== null}>
      {(Component: any) => {
        let loadedComponent: any;
        /* eslint-enable @typescript-eslint/no-explicit-any */
        if (Component === null) {
          loadedComponent = (
            <PageSection aria-label="Loading Content Container">
              <div className="pf-l-bullseye">
                <Alert title="Loading" className="pf-l-bullseye__item" />
              </div>
            </PageSection>
          );
        } else {
          loadedComponent = <Component.Support {...routeProps} />;
        }
        return loadedComponent;
      }}
    </DynamicImport>
  );
};

export interface IAppRoute {
  label?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  isAsync?: boolean;
}


const routes: IAppRoute[] = [
  {
    component: Dashboard,
    exact: true,
    label: 'Custom Report',
    path: '/',
    title: 'Curator | Custom Report'
  },
  // {
  //   component: Openshift,
  //   exact: true,
  //   isAsync: true,
  //   label: 'Openshift',
  //   path: '/openshift',
  //   title: 'OCP Metering | Openshift Page'
  // },
  // {
  //   component: Support,
  //   exact: true,
  //   isAsync: true,
  //   label: 'Support',
  //   path: '/support',
  //   title: 'OCP Metering | Support Page'
  // },
  // {
  //   component: Reports,
  //   exact: true,
  //   isAsync: true,
  //   label: 'Reports',
  //   path: '/reports',
  //   title: 'OCP Metering | Reports Page'
  // },
];

// A custom hook for sending focus to the primary content container
// after a view has loaded so that subsequent press of tab key
// sends focus directly to relevant content
const useA11yRouteChange = (isAsync: boolean) => {
  const lastNavigation = useLastLocation();
  React.useEffect(() => {
    if (!isAsync && lastNavigation !== null) {
      routeFocusTimer = accessibleRouteChangeHandler();
    }
    return () => {
      window.clearTimeout(routeFocusTimer);
    };
  }, [isAsync, lastNavigation]);
};

const RouteWithTitleUpdates = ({ component: Component, isAsync = false, title, ...rest }: IAppRoute) => {
  useA11yRouteChange(isAsync);
  useDocumentTitle(title);

  function routeWithTitle(routeProps: RouteComponentProps) {
    return <Component {...rest} {...routeProps} />;
  }

  return <Route render={routeWithTitle} />;
};

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route component={NotFound} />;
};

const AppRoutes = () => (
  <LastLocationProvider>
    <Switch>
      {routes.map(({ path, exact, component, title, isAsync }, idx) => (
        <RouteWithTitleUpdates
          path={path}
          exact={exact}
          component={component}
          key={idx}
          title={title}
          isAsync={isAsync}
        />
      ))}
      <Route exact path="/projectlist/:projectId" component={ProjectDetail} />
      <PageNotFound title="404 Page Not Found" />
    </Switch>
  </LastLocationProvider>
);

export { AppRoutes, routes };
