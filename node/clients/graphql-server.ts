import { AppClient, GraphQLClient, InstanceOptions, IOContext, RequestConfig } from '@vtex/api'


export class GraphQLServer extends AppClient {
  protected graphql: GraphQLClient

  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super('vtex.graphql-server@1.x', ctx, opts)
    this.graphql = new GraphQLClient(this.http)
  }

  public query = async (query: string, variables: any, extensions: any, config: RequestConfig) => {
    return this.graphql.query(
      {
        extensions,
        query,
        variables,
      },
      {
        ...config,
        url: '/graphql',
      }
    )
  }
}
