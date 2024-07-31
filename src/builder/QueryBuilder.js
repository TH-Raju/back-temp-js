/** @format */

class QueryBuilder {
  constructor(modelQuery, query) {
    this.modelQuery = modelQuery;
    this.query = query;
    this.exclusions = [];
    this.populatedFields = null;
  }

  search(searchableFields) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    // Filtering
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    this.modelQuery = this.modelQuery.find(queryObj);

    return this;
  }

  sort() {
    const sort = this?.query?.sort?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields = this?.query?.fields?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  exclude(fieldString) {
    this.exclusions.push(
      ...fieldString
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f)
    );
    return this;
  }

  applyExclusions() {
    if (this.exclusions.length > 0) {
      const exclusionString = this.exclusions
        .map((field) => `-${field}`)
        .join(" ");
      this.modelQuery = this.modelQuery.select(exclusionString);
    }
    return this;
  }

  populateFields(fields) {
    this.populatedFields = fields;
    return this;
  }

  async executePopulate() {
    if (this.populatedFields) {
      this.modelQuery.populate(this.populatedFields);
    }
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
