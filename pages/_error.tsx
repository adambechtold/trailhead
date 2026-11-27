import * as Sentry from "@sentry/nextjs";
import Error, { ErrorProps } from "next/error";
import { NextPageContext } from "next";

const CustomErrorComponent = (props: ErrorProps) => {
  return <Error statusCode={props.statusCode} />;
};

// Report server-side rendering errors to Sentry.
CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(contextData);
  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
