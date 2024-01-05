export type KafkaModuleOptions = {
  clientId: string;
  username?: string;
  password?: string;
  brokers: string[];
  groupId: string;
};
